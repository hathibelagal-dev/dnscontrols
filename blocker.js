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
