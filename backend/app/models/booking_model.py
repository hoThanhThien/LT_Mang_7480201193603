class Booking:
    def __init__(self, booking_id: int, user_id: int, tour_id: int, booking_date: str, number_of_people: int, total_amount: float, status: str, discount_id: int):
        self.booking_id = booking_id
        self.user_id = user_id
        self.tour_id = tour_id
        self.booking_date = booking_date
        self.number_of_people = number_of_people
        self.total_amount = total_amount
        self.status = status
        self.discount_id = discount_id
