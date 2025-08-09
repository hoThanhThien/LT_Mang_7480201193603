class User:
    def __init__(self, user_id: int, first_name: str, last_name: str, full_name: str, password: str, phone: str, email: str, role_id: int):
        self.user_id = user_id
        self.first_name = first_name
        self.last_name = last_name
        self.full_name = full_name
        self.password = password
        self.phone = phone
        self.email = email
        self.role_id = role_id
