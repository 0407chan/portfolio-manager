const functions = require("firebase-functions");
const admin = require("firebase-admin");
var serviceAccount = require("./todo-vue-3ea4e-firebase-adminsdk-33i4j-f348aa7434.json");
admin.initializeApp();
const db = admin.firestore();


exports.sendMessageOnCreatePortfolio = functions.firestore
    .document('/portfolios/{portfolioID}')
    .onWrite((change, context) => {
        let payload = {
            data: {}
        };
        console.log(change)
        if (change.after._fieldsProto !== undefined && change.before._fieldsProto === undefined) {
            payload.data.messageAbout = "Create";
            payload.data.title = change.after._fieldsProto.title.stringValue;
            payload.data.name = change.after._fieldsProto.name.stringValue;
            payload.data.classify = change.after._fieldsProto.classify.stringValue;
        } else if (change.after._fieldsProto !== undefined && change.before._fieldsProto !== undefined) {
            payload.data.messageAbout = "Update";
            payload.data.title = change.before._fieldsProto.title.stringValue;
            payload.data.name = change.before._fieldsProto.name.stringValue;
            payload.data.classify = change.before._fieldsProto.classify.stringValue;
        } else if(change.after._fieldsProto === undefined && change.before._fieldsProto !== undefined){
            payload.data.messageAbout = "Delete";
            payload.data.title = change.before._fieldsProto.title.stringValue;
            payload.data.name = change.before._fieldsProto.name.stringValue;
            payload.data.classify = change.before._fieldsProto.classify.stringValue;
        }
        const options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };
        return db.collection('messageList').get()
            .then(docSnapshots => {
                docSnapshots.docs.forEach(function (doc) {
                    mauload={
                        data:{
                            messageAbout: payload.data.messageAbout.toString(),
                            title: payload.data.title.toString(),
                            displayName: payload.data.name.toString(),
                            classify: payload.data.classify.toString(),
                        }
                    };
                    if (doc.data().allowPush === true) {
                        let registrationToken = doc.data().cloudMessaging;
                        admin.messaging().sendToDevice(registrationToken, mauload, options)
                            .then(function (response) {
                                console.log(response)
                                return response
                            })
                            .catch(function (err) {
                                return err
                            });
                    }
                });
                return docSnapshots
            })
            .catch(err => {
                return err
            });
    });

exports.sendMessageOnCreatePost = functions.firestore
    .document('/posts/{postID}')
    .onWrite((change, context) => {
        let payload = {
            data: {}
        };
        console.log(change)
        if (change.after._fieldsProto !== undefined && change.before._fieldsProto === undefined) {
            payload.data.messageAbout = "Create";
            payload.data.title = change.after._fieldsProto.title.stringValue;
            payload.data.name = change.after._fieldsProto.name.stringValue;
            payload.data.classify = change.after._fieldsProto.classify.stringValue;
        } else if (change.after._fieldsProto !== undefined && change.before._fieldsProto !== undefined) {
            payload.data.messageAbout = "Update";
            payload.data.title = change.before._fieldsProto.title.stringValue;
            payload.data.name = change.before._fieldsProto.name.stringValue;
            payload.data.classify = change.before._fieldsProto.classify.stringValue;
        } else if(change.after._fieldsProto === undefined && change.before._fieldsProto !== undefined){
            payload.data.messageAbout = "Delete";
            payload.data.title = change.before._fieldsProto.title.stringValue;
            payload.data.name = change.before._fieldsProto.name.stringValue;
            payload.data.classify = change.before._fieldsProto.classify.stringValue;
        }
        const options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };
        return db.collection('messageList').get()
            .then(docSnapshots => {
                docSnapshots.docs.forEach(function (doc) {
                    mauload={
                        data:{
                            messageAbout: payload.data.messageAbout.toString(),
                            title: payload.data.title.toString(),
                            displayName: payload.data.name.toString(),
                            classify: payload.data.classify.toString(),
                        }
                    };
                    if (doc.data().allowPush === true) {
                        let registrationToken = doc.data().cloudMessaging;
                        admin.messaging().sendToDevice(registrationToken, mauload, options)
                            .then(function (response) {
                                console.log(response)
                                return response
                            })
                            .catch(function (err) {
                                return err
                            });
                    }
                });
                return docSnapshots
            })
            .catch(err => {
                return err
            });
    });

exports.sendMessageOnCreateComment = functions.firestore
    .document('/comments/{commentID}')
    .onWrite((change, context) => {
        let payload = {
            data: {}
        };
        console.log(change)
        if (change.after._fieldsProto !== undefined && change.before._fieldsProto === undefined) {
            payload.data.messageAbout = "Create";
            payload.data.classify = change.after._fieldsProto.classify.stringValue;
            payload.data.body = change.after._fieldsProto.body.stringValue;
            payload.data.name = change.after._fieldsProto.name.stringValue;
        } else if (change.after._fieldsProto !== undefined && change.before._fieldsProto !== undefined) {
            payload.data.messageAbout = "Update";
            payload.data.classify = change.before._fieldsProto.classify.stringValue;
            payload.data.body = change.before._fieldsProto.body.stringValue;
            payload.data.name = change.before._fieldsProto.name.stringValue;
        } else if(change.after._fieldsProto === undefined && change.before._fieldsProto !== undefined){
            payload.data.messageAbout = "Delete";
            payload.data.classify = change.before._fieldsProto.classify.stringValue;
            payload.data.body = change.before._fieldsProto.body.stringValue;
            payload.data.name = change.before._fieldsProto.name.stringValue;
        }
        const options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };
        return db.collection('messageList').get()
            .then(docSnapshots => {
                docSnapshots.docs.forEach(function (doc) {
                    mauload={
                        data:{
                            messageAbout: payload.data.messageAbout.toString(),
                            body: payload.data.body.toString(),
                            classify: payload.data.classify.toString(),
                            displayName: payload.data.name.toString(),
                        }
                    };
                    if (doc.data().allowPush === true && doc.data().isAdmin === true) {
                        let registrationToken = doc.data().cloudMessaging;
                        admin.messaging().sendToDevice(registrationToken, mauload, options)
                            .then(function (response) {
                                console.log(response)
                                return response
                            })
                            .catch(function (err) {
                                return err
                            });
                    }
                });
                return docSnapshots
            })
            .catch(err => {
                return err
            });
    });
