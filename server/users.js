// const users=[];

// const addUser=({id, name,room})=>{
//     if (name) name = name.trim().toLowerCase();
//     if (room) room = room.trim().toLowerCase();

//     const existingUser=users.find((user)=>{
//         user.room===room && user.name=== name
//     })
//     if(existingUser){
//         return {error: 'User with this credentials already exist'}
//     }

//     const user = { id,name,room };

//     users.push(user);
//     return {user};
// }
// const removeUser=(id)=>{
    
//         const index=users.findIndex((user)=>user.id===id);

//         if(index!==-1){
//             return users.splice(index,1)[0];
//         }
    
// }
// const getUser=(id)=>{
//     users.find((user)=>user.id===id)
// }
// const getUserInRoom=(room)=>{
//     users.filter((user) => user.room===room);
// }

// module.exports={addUser, removeUser , getUser , getUserInRoom };

const users = [];

const addUser = ({id, name, room}) => {
    // Add null checks
    if (!name || !room) return { error: 'Username and room are required.' };
    
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Fixed the existingUser find callback - was missing return statement
    const existingUser = users.find((user) => 
        user.room === room && user.name === name
    );

    if (existingUser) {
        return { error: 'User with this credentials already exist' };
    }

    const user = { id, name, room };
    users.push(user);
    
    console.log('Users after add:', users); // Debug log
    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

// Fixed getUser - was missing return statement
const getUser = (id) => {
    return users.find((user) => user.id === id);
};

// Fixed getUserInRoom - was missing return statement
const getUserInRoom = (room) => {
    return users.filter((user) => user.room === room);
};

module.exports = { addUser, removeUser, getUser, getUserInRoom };