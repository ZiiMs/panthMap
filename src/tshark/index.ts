import { ChildProcess, spawn, spawnSync } from "child_process";
import * as os from 'os';

let tsharkProcess: ChildProcess | null = null;


// Interfaces
interface TSharkInterface {
  id: string;
  name: string;
  description: string;
  score?: number;
}

export function doesTSharkExist() {
  return !spawnSync('tshark', ['-h']).status;
}

export function stopPacketCapture() {
  tsharkProcess?.kill();
}

async function getBestTSharkInterface(): Promise<TSharkInterface> {
  try {
    const tsharkList = spawnSync('tshark', ['-D']);
    if (tsharkList.status !== 0 || tsharkList.error) {
      throw new Error(
        tsharkList.error?.message || 'tshark interface list failed'
      );
    }

    const interfaces = tsharkList.stdout
      .toString()
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        const match = line.match(/(\d+)\. (\S+) \((.+)\)/);
        return match
          ? { id: match[1], name: match[2], description: match[3] }
          : null;
      })
      .filter(Boolean) as TSharkInterface[];

    const systemInterfaces = os.networkInterfaces();
    const scored = interfaces.map((iface) => {
      let score = 0;
      const sysIface = Object.entries(systemInterfaces).find(
        ([name]) => name === iface.name
      );

      if (sysIface) {
        score += 50;
        const hasValidAddress = sysIface[1]?.some(
          (addr) => !addr.internal && addr.family === 'IPv4'
        );
        if (hasValidAddress) score += 30;
      }

      if (iface.description.includes('Ethernet')) score += 20;
      else if (iface.description.includes('Wi-Fi')) score += 15;
      else if (iface.description.includes('Virtual')) score -= 40;

      return { ...iface, score };
    });

    return scored.reduce((prev, current) =>
      prev.score > current.score ? prev : current
    );
  } catch (error) {
    console.error('Interface selection error:', error);
    throw error;
  }
}


// TShark Interface Selection

// Packet Processing
// function processHexData(hexData: string) {
//     try {
//         const cleanHex = hexData.replace(/[: \n]/g, '');
//         const packetBuffer = Buffer.from(cleanHex, 'hex');
//         const locationHeader = Buffer.from('Your location: ');
//         const headerIndex = packetBuffer.indexOf(locationHeader);
//
//         if (headerIndex === -1) return;
//
//         const coordStart = headerIndex + locationHeader.length;
//         const coordEnd = packetBuffer.indexOf(0x00, coordStart);
//         const coordString = packetBuffer
//             .subarray(coordStart, coordEnd)
//             .toString('ascii')
//             .trim();
//
//         const coords = coordString.split(' ');
//         if (coords.length === 4) {
//             const coordData: CoordinateData = {
//                 x: coords[0],
//                 y: coords[1],
//                 z: coords[2],
//                 system: coords[3],
//             };
//             mainWindow?.webContents.send('location-update', coordData);
//         }
//     } catch (error) {
//         console.error('Data processing error:', error);
//     }
// }

export function startPacketCapture(cb: (x: number, y: number) => void) {
  getBestTSharkInterface()
    .then((iface) => {
      console.log(`Starting capture on ${iface.name} (${iface.description})`);

      tsharkProcess = spawn('tshark', [
        '-l', // line-buffered
        '-n', // no name resolution
        '-T',
        'ek', // Use JSON output (1 packet per line)
        '-i',
        iface.name,
        '-Y',
        'udp contains "Your location:"', // Filter packets with location data
        '-e',
        'data.data', // Extract the `data.data` field
        '-f',
        'host 20.22.206.251',
      ]);

      let leftover = '';
      tsharkProcess.stdout?.on('data', (chunk) => {
        leftover += chunk.toString('utf8');
        let lineEnd;

        // Process all complete lines in the leftover buffer
        console.log('Before while loop');
        while ((lineEnd = leftover.indexOf('\n')) >= 0) {
          const line = leftover.slice(0, lineEnd).trim();
          leftover = leftover.slice(lineEnd + 1);

          if (!line) continue;
          // console.log(line, 'line after first if')

          try {
            const packet = JSON.parse(line);
            // console.log(packet, 'packet')

            // Skip the "index" metadata line
            if (packet.index) continue;
            // console.log('after conditional on 238')

            // Extract data from the "_source" line
            if (packet.layers?.data_data[0]) {
              // console.log(packet.layers?.data_data[0], 'hexcode')
              // console.log('after 242 conditional')
              const hexString = packet.layers.data_data[0].replace(/[: ]/g, ''); // Remove colons/spaces
              const buffer = Buffer.from(hexString, 'hex');
              const asciiString = buffer.toString('ascii');
              // console.log(asciiString, 'asciiString')

              // Extract location

              const startIdx = asciiString.indexOf('Your location:') + 14;
              const endIdx = asciiString.indexOf('\t', startIdx);
              const location = asciiString.slice(startIdx, endIdx).trim();

              if (location) {
                const coordArray = location.split(' ');
                const xCoord = Math.floor(Number(coordArray[0]))
                const yCoord = Math.floor(Number(coordArray[2]))
                // const url = `https://shalazam.info/maps/1?zoom=5&x=${xCoord}&y=3533&pin%5B%5D=2742.3532.Dropped+Pin`;
                console.log('Location:', location);

                cb(xCoord, yCoord);
              }
            }
          } catch (err) {
            console.error('Error parsing line:', err);
          }
        }
      });

      tsharkProcess.stderr?.on('data', (data) => {
        console.error('TSHARK ERROR:', data.toString());
      });

      tsharkProcess.on('close', (code) => {
        console.log(`Capture stopped (code ${code})`);
        tsharkProcess = null;
      });
    })
    .catch((error) => {
      throw new Error(`Failed to start packet capture: ${error}`);
    });
}





