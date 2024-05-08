const {db} = require('../db.js');

/*
exports.getGroup = async (req, res) => {
    try {
        const groupDocument = db.doc(`groups/${req.params.gid}/`);
        const snapshot = await groupDocument.get();

        if (!snapshot.exists) {
            res.status(404)
        } else {
            const groupData = snapshot.data();
            res.status(200).json({
                groupId: snapshot.id,
                ...groupData
            });
        }
    } catch (error) {
        console.error('Error :', error);
        res.status(500).send('Internal Server Error');
    }
}*/

exports.getGroup = async (req, res) => {
    try {
        const groupDocument = db.doc(`groups/${req.params.gid}`);
        const snapshot = await groupDocument.get();

        if (!snapshot.exists) {
            res.status(404).send('Group not found');
        } else {
            const groupData = snapshot.data();
            const expensesCollection = groupDocument.collection('expenses');
            const expensesSnapshot = await expensesCollection.get();
            const expenses = [];

            expensesSnapshot.forEach(doc => {
                expenses.push({ expenseId: doc.id, ...doc.data() });
            });

            res.status(200).json({
                groupId: snapshot.id,
                ...groupData,
                expenses: expenses
            });
        }
    } catch (error) {
        console.error('Error :', error);
        res.status(500).send('Internal Server Error');
    }
}



exports.postGroup = async (req, res) => {
    try {
        const groupCollection = db.collection('groups');
        const {...newData} = req.body;

        const docRef = await groupCollection.add(newData);
        const newDocId = docRef.id; // ID du nouveau document créé

        try {
            const userCollection = db.collection(`users/${req.body.userId}/groups`);

            await userCollection.doc(newDocId).set({
                title: req.body.title,
                description: req.body.description
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
        res.status(201).end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
