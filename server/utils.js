function CurrentDate() { 
    this.dateString = new Date();
    this.year = this.dateString.getFullYear();
    this.month = this.dateString.getMonth();
    this.date = this.dateString.getDate();
}