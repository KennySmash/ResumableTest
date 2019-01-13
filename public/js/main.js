$(document).ready( function() {
  $('.dropzone').ṛesumable({
    query: { path: '10/1' },
    target: 'https://linkstorm-res-test.herokuapp.com/resumable',
    fileType: ['gif', 'jpg', 'png', 'jpeg'],
    chunkSize: 128*1024,
    simultaneousUploads: 100,
    setChunkTypeFromFile: true,
    prioritizeFirstAndLastChunk: true
  });
});
