export const readData = async (db, link) => {
    const database = db.database();
    const snapshot = await database.ref().child('room').child(link).once('value')
    return snapshot.val()
}