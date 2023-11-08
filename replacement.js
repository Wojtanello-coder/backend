class Replacement {
    constructor(_class, hour, teacher, subTeacher, subject) {
        this.class = _class,
        this.hour = hour,
        this.teacher = teacher,
        this.subTeacher = subTeacher,
        this.subject = subject
    }
    json() {
        return [ this.class, this.hour, this.teacher, this.subTeacher, this.subject ];
    }
    static json(_class, hour, teacher, subTeacher, subject) {
        return [ _class, hour, teacher, subTeacher, subject ];
    }
}