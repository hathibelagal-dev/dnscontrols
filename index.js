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

import {
  SERVER_READY,
  CACHED,
  BLOCKED,
  FOUND,
  NAME,
  LOCALHOST,
} from "./strings.js";
import { logger } from "./logger.js";
import { createSocket } from "dgram";
import {
  updateCache,
  fetchFromCache,
  countCachedItems,
  getNBlocks,
  updateNBlocks,
} from "./cache.js";
import {
  readDNSQuery,
  createDNSResponse,
  extractIPAddressFromDNSResponse,
} from "./dnsutils.js";
import { hostsToBlock, readBlockList } from "./blocker.js";

function getIP(domain) {
  if (hostsToBlock[domain]) {
    updateNBlocks();
    return LOCALHOST;
  }
  return fetchFromCache(domain);
}

const DNS_PORT = 53;
const GOOGLE_DNS_IP = "8.8.8.8";

logger.debug("Reading DNS blocklist");
readBlockList();
logger.debug("Finished reading DNS blocklist");
logger.debug("Starting " + NAME + "...");
const server = createSocket("udp4");

server.on("message", (msg, rinfo) => {
  const dnsRequest = readDNSQuery(msg);

  let ip = getIP(dnsRequest.domain);
  if (ip) {
    const dnsResponse = createDNSResponse(dnsRequest, ip);
    server.send(dnsResponse, rinfo.port, rinfo.address, (err) => {
      if (err) {
        console.error("Error sending response:", err);
      }
      logger.info(
        dnsRequest.domain + " : " + ip,
        ip == LOCALHOST ? BLOCKED : CACHED
      );
    });
  } else {
    const client = createSocket("udp4");
    client.send(msg, DNS_PORT, GOOGLE_DNS_IP, (err) => {
      if (err) console.error("Error forwarding query:", err);
    });
    client.on("message", (response) => {
      let returnedIP = extractIPAddressFromDNSResponse(response);
      if (returnedIP) {
        updateCache(dnsRequest.domain, returnedIP);
        logger.info(dnsRequest.domain + " : " + returnedIP, FOUND);
      }
      server.send(response, rinfo.port, rinfo.address, (err) => {
        if (err) console.error("Error sending response:", err);
      });
      client.close();
    });
  }
});

server.bind(DNS_PORT, () => {
  logger.debug(SERVER_READY + DNS_PORT);
});

setInterval(() => {
  logger.debug(
    "Cache size: " + countCachedItems() + " | Requests blocked: " + getNBlocks()
  );
}, 30000);
