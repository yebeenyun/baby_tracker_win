from typing import TypedDict, Optional, Literal

ProfileId = int
FeedingId = int
DiaperId = int
Gender = Literal["male", "female", "unknown", "M", "F", "U"]
DateStr = str          # "YYYY-MM-DD"
DateTimeStr = str      # "YYYY-MM-DD HH:MM:SS"


class ProfileRow(TypedDict):
    id: ProfileId
    name: str
    birth_date: Optional[DateStr]
    gender: Optional[str]         # DB 저장값은 자유롭게 둘 수 있어 str로 둠 (원하면 Gender로 제한 가능)
    photo_path: Optional[str]


class FeedingRow(TypedDict):
    id: FeedingId
    profile_id: ProfileId
    datetime: DateTimeStr
    amount_ml: int


class DiaperRow(TypedDict):
    id: DiaperId
    profile_id: ProfileId
    datetime: DateTimeStr
    pee: int     # DB에는 0/1로 저장
    poop: int    # DB에는 0/1로 저장