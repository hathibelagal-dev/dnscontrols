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

import { logger } from "./logger.js";
import { BLOCKLIST_FILE } from "./strings.js";
import fs from "fs";
import readline from 'readline';

export const hostsToBlock = {};

export const readBlockList = () => {
  try {
    const data = fs.readFileSync(BLOCKLIST_FILE, "utf8");
    const hosts = data.split(/\r?\n/);   
    for(const host of hosts) {
        if(host && !host.startsWith("#")) {
            hostsToBlock[host] = true;
        }
    }
    logger.debug("Found " + Object.keys(hostsToBlock).length + " hosts to block");
  } catch (err) {
    console.err("Couldn't read blocklist file at " + BLOCKLIST_FILE);
  }
};
