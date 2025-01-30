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

const dnsCache = {};
var nBlocks = 0;

export const fetchFromCache = (domain) => {
  return dnsCache[domain];
};

export const updateCache = (domain, ip) => {
  dnsCache[domain] = ip; 
};

export const countCachedItems = () => {
  return Object.keys(dnsCache).length;
};

export const updateNBlocks = () => {
  nBlocks += 1;
}

export const getNBlocks = () => {
  return nBlocks;
}