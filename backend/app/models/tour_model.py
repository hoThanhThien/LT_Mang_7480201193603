class Tour:
    def __init__(self, tour_id: int, title: str, location: str, description: str, capacity: int, price: float, start_date: str, end_date: str, status: str, category_id: int):
        self.tour_id = tour_id
        self.title = title
        self.location = location
        self.description = description
        self.capacity = capacity
        self.price = price
        self.start_date = start_date
        self.end_date = end_date
        self.status = status
        self.category_id = category_id
