export class EntryObj {
    constructor(title, coordinatesArray, postContents, images) {
        this.title = title;
        this.coordinates = coordinatesArray
        this.postContents = postContents
        this.images = images || []
    }
}