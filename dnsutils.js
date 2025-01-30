/*
   Copyright 2025 Ashraff Hathibelagal

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

export const createDNSResponse = (query, ip) => {
  const header = Buffer.from([
    (query.transactionId >> 8) & 0xff,
    query.transactionId & 0xff,
    0x81,
    0x80,
    0x00,
    0x01,
    0x00,
    0x01,
    0x00,
    0x00,
    0x00,
    0x00,
  ]);

  const domainParts = query.domain.split(".");
  let domainBuffer = Buffer.alloc(0);
  domainParts.forEach((part) => {
    domainBuffer = Buffer.concat([
      domainBuffer,
      Buffer.from([part.length]),
      Buffer.from(part),
    ]);
  });
  domainBuffer = Buffer.concat([domainBuffer, Buffer.from([0])]);

  const questionBuffer = Buffer.concat([
    domainBuffer,
    Buffer.from([0x00, 0x01]),
    Buffer.from([0x00, 0x01]),
  ]);

  const answerBuffer = Buffer.concat([
    domainBuffer,
    Buffer.from([0x00, 0x01]),
    Buffer.from([0x00, 0x01]),
    Buffer.from([0x00, 0x00, 0x00, 0x3c]),
    Buffer.from([0x00, 0x04]),
    Buffer.from(ip.split(".").map(Number)),
  ]);

  return Buffer.concat([header, questionBuffer, answerBuffer]);
};

export const extractIPAddressFromDNSResponse = (msg) => {
    let offset = 12;

    while (msg[offset] !== 0) offset++;
    offset += 5;

    while (offset < msg.length) {
        offset += 10;
        const dataLength = msg.readUInt16BE(offset);
        offset += 2;

        if (dataLength === 4) {
            const ip = `${msg[offset++]}.${msg[offset++]}.${msg[offset++]}.${msg[offset++]}`;
            return ip;
        } else {
            offset += dataLength;
        }
    }

    return false;
}

export const readDNSQuery = (msg) => {
  let offset = 0;

  const output = {};

  output.transactionId = msg.readUInt16BE(offset);
  offset += 2;

  output.flags = msg.readUInt16BE(offset);
  offset += 2;

  output.nQuestions = msg.readUInt16BE(offset);
  offset += 2;

  offset += 6;

  output.domain = "";
  for (let i = 0; i < output.nQuestions; i++) {
    let labelLength = msg[offset];
    offset++;

    while (labelLength !== 0) {
      output.domain += msg.slice(offset, offset + labelLength).toString() + ".";
      offset += labelLength;

      labelLength = msg[offset];
      offset++;
    }
  }

  output.domain = output.domain.slice(0, -1);

  output.rrType = msg.readUInt16BE(offset);
  offset += 2;

  output.rrClass = msg.readUInt16BE(offset);
  offset += 2;

  return output;
};
