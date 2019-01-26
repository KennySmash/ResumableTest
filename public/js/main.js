$(document).ready( function() {
  var zone = $('.dropzone').ṛesumable({
    query: { path: '10/1' },
    target: 'https://linkstorm-res-test.herokuapp.com/resumable',
    fileType: ['gif', 'jpg', 'png', 'jpeg'],
    chunkSize: 128*1024,
    simultaneousUploads: 100,
    setChunkTypeFromFile: true,
    prioritizeFirstAndLastChunk: true
  });

  console.log(zone);

  axios.get('https://linkstorm.res-test.herokuapp.com/bucket/status')
    .then(function(response){
      console.log('status GET', response);
    }).catch( function (error){
      console.error(error);
    })
});
