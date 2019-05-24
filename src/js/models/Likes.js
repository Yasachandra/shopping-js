export default class {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {id, title, author, img};
        this.likes.push(like);

        // Persist data in local storage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index,1);

        // Persist data in local storage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // Restoring the liked recipes from the local storage
        if(storage) this.likes = storage;
    }

    persistData() {
        localStorage.setItem('likes',JSON.stringify(this.likes));
    }
}