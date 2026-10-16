/* RT roster PWA shell only. Supabase requests and dynamic auth data are always network-only. */
const CACHE_NAME='rt-roster-shell-v10-4';
const FILES=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('rt-roster-shell-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{const req=event.request;const url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin)return; if(url.pathname.endsWith('/config.js')){event.respondWith(fetch(new Request(req,{cache:'no-store'})));return;}const scope=new URL(self.registration.scope);if(!url.pathname.startsWith(scope.pathname))return;if(url.pathname.includes('/rest/')||url.pathname.includes('/auth/')||url.pathname.includes('/realtime/'))return;
 if(req.mode==='navigate'){event.respondWith(fetch(req).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy))}return response}).catch(()=>caches.match('./index.html')));return}
 if(FILES.some(f=>new URL(f,self.registration.scope).pathname===url.pathname)){event.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(cache=>cache.put(req,copy))}return res}).catch(()=>caches.match(req)));}
});
