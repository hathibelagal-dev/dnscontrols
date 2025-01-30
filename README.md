# NyxShield
NyxShield is a simple DNS-based ad blocker, powered by Node.

## How to Use

1. Create a file named **blocked_hosts.txt** in NyxShield's root directory. Add all the domains you want to add to it. There should be exactly one domain per line in the file.

2. Start the NyxShield DNS server:

```
npm start
```

3. Go to any device's DNS settings and replace your ISP's DNS servers' IPs with your own server's IP.

4. That's it. Experience freedom from annoying ads and trackers!

Note: NyxShield uses Google's DNS servers to resolve domains that are not to be blocked.


