const storage = firebase.storage()
const storageRef = storage.ref()

const imageForm = document.querySelector('#imageForm');

// write data function
function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        profile_picture: imageUrl
    });
}

// read from database
const snap = () => {
    var starCountRef = firebase.database().ref('users/'+10);
    starCountRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log(data);
    });
}

imageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    var metadata = {
        contentType: 'image/jpeg'
    };
    
    var file = imageForm.querySelectorAll('input')[3].files[0]

    var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

    
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
        
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {    
            case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
            
            case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
        }
    }, (error) => {
        
        switch (error.code) {
            case 'storage/unauthorized':
                console.log("err unauthorized");
                break;
            
            case 'storage/canceled':
                console.log("err canceled by user");
                break;
            
            case 'storage/unknown':
                console.log("err storage unknown");
                break;
        }
    }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            writeUserData(10, "Franklin", "tchfrnkln@gmail.com", downloadURL);
        });
    }
    );
    
})


