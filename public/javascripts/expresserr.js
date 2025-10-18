class expresserr extends  Error{
    constructor(statuscode,msg){
        super();
        this.statuscode = statuscode;
        this.msg=msg;
    }
}
module.exports = expresserr;