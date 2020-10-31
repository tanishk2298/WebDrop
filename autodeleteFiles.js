const File = require('./module/file')
const fs = require('fs')
const connectDB = require('./config/db')
connectDB()

async function deleteData(){
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const files = await File.find({createdAt : {$lt: pastDate}})

    if(files.length){
        for(const file of files){
            try{
                fs.unlinkSync(file.path)
                await file.remove();
                console.log(`Successfully deleted ${file.name}`)
            }catch(err){
                console.log(`Error while deleting file ${err}`)
            }
        }
        console.log('Done')
    }
}

deleteData().then(() => {
    process.exit()
})