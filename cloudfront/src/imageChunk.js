var exportedModule = {
    /*
        Chunks an Image and returns an Objarr of chunks
    */
    chunkImage: function(chunkSizeInByte, fileId, FileObj){
        var chunkArr = {};
        if (FileObj != undefined){
            var CCount = Math.ceil(FileObj.size / chunkSizeInByte, chunkSizeInByte);
            var currChunk = 0;

            while(currChunk < CCount){
                var offset = currChunk * chunkSizeInByte;
                chunkArr[currChunk] = {
                    chunkId: currChunk,
                    file: fileId,
                    data: FileObj.slice(offset, offset+chunkSizeInByte)
                }
                currChunk++;
            }
        }
        
        return chunkArr
    }

}


module.exports = exportedModule;