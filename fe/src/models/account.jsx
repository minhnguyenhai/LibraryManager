class Account {
    constructor(data) {
        this.id = data.id;
        this.email = data.email;
        this.name = data.name;
        this.phone_number = data.phone_number;
        this.address = data.address;
        this.dob = data.dob;
        this.gender = data.gender;
        this.created_at = data.created_at
        this.updated_at = data.updated_at
        this.role = data.role
    }
}

export default Account;