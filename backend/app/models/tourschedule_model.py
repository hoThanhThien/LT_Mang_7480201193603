class TourSchedule:
    def __init__(self, schedule_id: int, tour_id: int, day_number: int, time: str, location: str, activity: str):
        self.schedule_id = schedule_id
        self.tour_id = tour_id
        self.day_number = day_number
        self.time = time
        self.location = location
        self.activity = activity
