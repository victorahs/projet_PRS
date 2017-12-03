/*-----------------DEFINITION DU NOM DU CACHE ET DEFINITION DES FICHIERS A METTRE DEDANS----------------*/
var cacheName= 'v1';
var cacheFiles = [

      'index.html',
        'css/bootstrap.css',
        'css/leaflet.css',
        'css/style.css',
        'js/bootstrap.min.js',
        'js/tile_cached.js',
        'js/leaflet-src.js',
        'js/pouchdb-6.1.2.js',
        'css/images/marker-icon-2x.png'

];

/*-----------------------------------INSTALLATION DU SERVICE WORKER-------------------------------------*/


self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Installer');

    // e.waitUntil Delays the event until the Promise is resolved
    e.waitUntil(

    	// Open the cache
	    caches.open(cacheName).then(function(cache)
      {
	    // Add all the default files to the cache
			console.log('[ServiceWorker] ajout des fichier au cache');
			return cache.addAll(cacheFiles);
	    })
	); // end e.waitUntil
});



/*--------------------------------------------ACTIVATION DU SERVICE WORKER------------------------------*/

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activer');

    e.waitUntil(

    	// Get all the cache keys (cacheName)
		caches.keys().then(function(cacheNames) {
			return Promise.all(cacheNames.map(function(thisCacheName) {

				// If a cached item is saved under a previous cacheName
				if (thisCacheName !== cacheName) {

					// Delete that cached file
					console.log('[ServiceWorker] effacement de al précédente version du ServiceWorker- ', thisCacheName);
					return caches.delete(thisCacheName);
				}
			}));
		})
	); // end e.waitUntil

});


/*--------------------------------------------------RECUPÉRATION DES REQUETES---------------------------*/


self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Recuperation', e.request.url);

	// e.respondWidth Responds to the fetch event
	e.respondWith(

		// Check in cache for the request being made
		caches.match(e.request)
.then(function(response) {

				// If the request is in the cache
				if (response) {
					console.log("[ServiceWorker] trouver dans le cache", e.request.url, response);
					// Return the cached version
					return response;
				}
                

                    
var fetchRequest = e.request.clone();
    return fetch(fetchRequest).then(
        function(response){
            //on test la validité de la réponse
            
                if(!response || response.status !==200){
                    
                     console.log("[ServiceWorker] réponse non valide", e.request.url, response);
                    return response;
                }
                
                var responseToCache = response.clone();
                caches.open(cacheName)
                    .then(function(cache){
                    cache.put(e.request, responseToCache);
                    console.log("[ServiceWorker] Reponse ajouté au cache", e.request.url, response);
                });
            return response;
            
        
        }
    );
                

				


			}) // end caches.match(e.request)
	); // end e.respondWith
});