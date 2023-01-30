from accessData import getUser

class UserLogin():

    def fromJSON(self, user_id):
        self.__user = getUser(user_id)
        return self 

    # метод, вызываемый при авторизации на сайте
    def create(self, user):
        self.__user = user
        return self

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.__user['id'])