const functions = require("firebase-functions");
const admin = require("firebase-admin");
var serviceAccount = require("./todo-vue-3ea4e-firebase-adminsdk-33i4j-f348aa7434.json");
admin.initializeApp();
// exports.newPortfolioNotification = functions.firestore
//     .document("portfolios/{docId}")
//     .onCreate((snap, context) => {
//         return sendPushMessage("portfolio", snap);
//     });
// exports.newPostNotification = functions.firestore
//     .document("posts/{docId}")
//     .onCreate((snap, context) => {
//         return sendPushMessage("post", snap);
//     });
// function returnDetailPageLink(board, docId) {
//     const link =
//         "https://todo-vue-3ea4e.firebaseapp.com/" +
//         board +
//         "Detail/" +
//         docId;
//     return link;
// }
// function sendPushMessage(board, docSnapShot) {
//     const snapShotData = docSnapShot.data();
//     const topic = "NewPost";
//     const title = "New " + board + " posted!";
//     const body = "Checkout " + snapShotData.name + "'s new " + board;
//     const link = returnDetailPageLink(board, docSnapShot.id);
//     var message = {
//         notification: {
//             title: title,
//             body: body,
//         },
//         topic: topic,
//         webpush: {
//             fcm_options: {
//                 link: link,
//             },
//             notification : {
//                 icon : "https://i.imgur.com/wxV4WcW.png"
//             }
//         },
//     };
//     return admin
//         .messaging()
//         .send(message)
//         .catch(error => {
//             console.log(`FCM ERROR(${board}) : ${error}`);
//         });
// }
// exports.newCommentNotification = functions.firestore
//     .document("comments/{cid}")
//     .onCreate(async snap => {
//         const snapData = snap.data();
//         const docID = snapData.pID;
//         const board = snapData.board;
//         let uid = await admin
//             .firestore()
//             .collection(board)
//             .doc(docID)
//             .get()
//             .then(docSnapShots => {
//                 return docSnapShots.data().writerId;
//             });
//         let message = await admin
//             .firestore()
//             .collection("loginUser")
//             .doc(uid)
//             .get()
//             .then(docSnapShots => {
//                 const token = docSnapShots.data().token;
//                 if (!token) {
//                     console.log("Post owner is not online");
//                     return null;
//                 }
//                 const title = "Checkout New comment on your " + board + "!";
//                 const boardName = board.slice(0, board.length - 1);
//                 const link = returnDetailPageLink(boardName, docID);
//                 const message = {
//                     notification: {
//                         title: title,
//                     },
//                     token: token,
//                     webpush: {
//                         fcm_options: {
//                             link: link,
//                         },
//                         notification : {
//                             icon : "https://i.imgur.com/wxV4WcW.png"
//                         }
//                     },
//                 };
//                 return message;
//             });
//         if (!message) {
//             return null;
//         }
//         return admin
//             .messaging()
//             .send(message)
//             .catch(error => {
//                 console.log(`FCM ERROR(comment) : ${error}`);
//             });
//     });
// exports.subscribeLoginUser = functions.firestore
//     .document("loginUser/{uid}")
//     .onCreate(snap => {
//         const LoginUserFcmToken = snap.data().token;
//         const topic = "NewPost";
//         const loginUserUid = snap.id;
//         console.log(loginUserUid, " save token");
//         return admin
//             .messaging()
//             .subscribeToTopic(LoginUserFcmToken, topic)
//             .catch(error => {
//                 console.log(`SUBSCRIBE ERROR : ${error}`);
//             });
//     });
// exports.unsubscribeLogoutUser = functions.firestore
//     .document("loginUser/{uid}")
//     .onDelete(snap => {
//         const LogoutUserFcmToken = snap.data().token;
//         const topic = "NewPost";
//         const logoutUserUid = snap.id;
//         console.log(logoutUserUid, " delete token");
//         return admin
//             .messaging()
//             .unsubscribeFromTopic(LogoutUserFcmToken, topic)
//             .catch(error => {
//                 console.log(`UNSUBSCRIBE ERROR : ${error}`);
//             });
//     });
// exports.deleteUserAuth = functions.firestore
//     .document("user/{uid}")
//     .onDelete(snap => {
//         console.log("delete user");
//         return admin
//             .auth()
//             .deleteUser(snap.id)
//             .catch(error => {
//                 console.log(error);
//             });
//     });
exports.sendMessageOnCreatePortfolio = functions.firestore
.document('/portfolios/{portfolioID}')
.onWrite((change, context) => {
    const registrationToken = "dIm8eaZ0uo8:APA91bHYWAz9lIx6Qx2_4qZwN9BzWZW1c4M3jS9v6AR6i6yDU5gksVWpFLckBKgBkxCgKtxpyzCRn7hfROwdhwFgzSLYCdaGIq8CM5qKbwEmJE3hOAAsKwEQuAJOpwPomAtkUH5eGLv9"
    const options = {
        priority: "high",                                                                    
        timeToLive: 60 * 60 * 24
    };
    const payload={
        data:{
            userID:"hihi"
        }
    };
    admin.messaging().sendToDevice(registrationToken, payload, options)
        .then(function (response) {
            return response
        })
        .catch(function (err) {
            return err
        });
});