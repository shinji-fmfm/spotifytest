    var stateKey = 'spotify_auth_state';

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    /**
     * Generates a random string containing numbers and letters
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    function generateRandomString(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    var params = getHashParams();

    var access_token = params.access_token,
        state = params.state,
        storedState = localStorage.getItem(stateKey);

    if (access_token && (state == null || state !== storedState)) {
        alert('There was an error during the authentication');
        location.href = "test02.html";
    } else {
        localStorage.removeItem(stateKey);

        if (access_token) {
            var Spotify = require('spotify-web-api-js');
            var spotifyApi = new Spotify();

            spotifyApi.setAccessToken(access_token);
            // get Elvis' albums, passing a callback. When a callback is passed, no Promise is returned
            spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    $("pre#result_data").text(data);
                }
            });
            $('#login').hide();
            $('#loggedin').show();            
        } else {
            $('#login').show();
            $('#loggedin').hide();
        }

        document.getElementById('login-button').addEventListener('click', function() {
            var client_id = '4f3ef64319314f4a87543fbbe2cc2fee'; // Your client id
            var redirect_uri = 'https://shinji-fmfm.github.io/spotifytest/test02.html'; // Your redirect uri

            var state = generateRandomString(16);

            localStorage.setItem(stateKey, state);
            var scope = 'streaming user-read-email user-read-private';

            var url = 'https://accounts.spotify.com/authorize';
            url += '?response_type=token';
            url += '&client_id=' + encodeURIComponent(client_id);
            url += '&scope=' + encodeURIComponent(scope);
            url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
            url += '&state=' + encodeURIComponent(state);

            window.location = url;
        }, false);
    }
