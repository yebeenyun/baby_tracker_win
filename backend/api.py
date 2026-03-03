import sqlite3
from typing import Optional, List, Dict, Any

from constants import DB_PATH
from type import DiaperId, DateTimeStr, DiaperRow, ProfileId, FeedingId, FeedingRow, DateStr, Gender, ProfileRow


class Api:
    def __init__(self, db_path: str = DB_PATH) -> None:
        self._conn = sqlite3.connect(db_path)
        self._conn.row_factory = sqlite3.Row
        self._conn.execute("PRAGMA foreign_keys = ON;")
        self.init_db()

    def init_db(self) -> None:
        cur = self._conn.cursor()

        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS profile (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                name        TEXT NOT NULL,
                birth_date  TEXT,
                gender      TEXT,
                photo_path  TEXT
            );
            """
        )

        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS feeding (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                profile_id  INTEGER NOT NULL,
                datetime    TEXT NOT NULL,
                amount_ml   INTEGER NOT NULL CHECK (amount_ml >= 0),
                FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
            );
            """
        )
        cur.execute("CREATE INDEX IF NOT EXISTS idx_feeding_profile_datetime ON feeding(profile_id, datetime);")

        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS diaper (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                profile_id  INTEGER NOT NULL,
                datetime    TEXT NOT NULL,
                pee         INTEGER NOT NULL CHECK (pee IN (0, 1)),
                poop        INTEGER NOT NULL CHECK (poop IN (0, 1)),
                FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
            );
            """
        )
        cur.execute("CREATE INDEX IF NOT EXISTS idx_diaper_profile_datetime ON diaper(profile_id, datetime);")

        self._conn.commit()

    # -------------------------
    # Profile CRUD
    # -------------------------
    def create_profile(
        self,
        name: str,
        birth_date: Optional[DateStr] = None,
        gender: Optional[Gender] = None,
        photo_path: Optional[str] = None,
    ) -> ProfileId:
        cur = self._conn.execute(
            """
            INSERT INTO profile (name, birth_date, gender, photo_path)
            VALUES (?, ?, ?, ?);
            """,
            (name, birth_date, gender, photo_path),
        )
        self._conn.commit()
        return int(cur.lastrowid)

    def read_profile(self, profile_id: ProfileId) -> Optional[ProfileRow]:
        row = self._conn.execute("SELECT * FROM profile WHERE id = ?;", (profile_id,)).fetchone()
        return ProfileRow(**dict(row)) if row else None  # type: ignore[misc]

    def list_profiles(self, limit: int = 100, offset: int = 0) -> List[ProfileRow]:
        rows = self._conn.execute(
            """
            SELECT * FROM profile
            ORDER BY id ASC
            LIMIT ? OFFSET ?;
            """,
            (limit, offset),
        ).fetchall()
        return [ProfileRow(**dict(r)) for r in rows]  # type: ignore[misc]

    def update_profile(
        self,
        profile_id: ProfileId,
        *,
        name: Optional[str] = None,
        birth_date: Optional[DateStr] = None,
        gender: Optional[Gender] = None,
        photo_path: Optional[str] = None,
    ) -> None:
        updates: Dict[str, Any] = {}
        if name is not None:
            updates["name"] = name
        if birth_date is not None:
            updates["birth_date"] = birth_date
        if gender is not None:
            updates["gender"] = gender
        if photo_path is not None:
            updates["photo_path"] = photo_path
        if not updates:
            return

        set_clause = ", ".join([f"{k} = ?" for k in updates.keys()])
        params = list(updates.values()) + [profile_id]
        self._conn.execute(f"UPDATE profile SET {set_clause} WHERE id = ?;", params)
        self._conn.commit()

    def delete_profile(self, profile_id: ProfileId) -> None:
        self._conn.execute("DELETE FROM profile WHERE id = ?;", (profile_id,))
        self._conn.commit()

    # -------------------------
    # Feeding CRUD
    # -------------------------
    def create_feeding(self, profile_id: ProfileId, datetime: DateTimeStr, amount_ml: int) -> FeedingId:
        cur = self._conn.execute(
            "INSERT INTO feeding (profile_id, datetime, amount_ml) VALUES (?, ?, ?);",
            (profile_id, datetime, amount_ml),
        )
        self._conn.commit()
        return int(cur.lastrowid)

    def read_feeding(self, feeding_id: FeedingId) -> Optional[FeedingRow]:
        row = self._conn.execute("SELECT * FROM feeding WHERE id = ?;", (feeding_id,)).fetchone()
        return FeedingRow(**dict(row)) if row else None  # type: ignore[misc]

    def list_feedings(
        self,
        profile_id: ProfileId,
        start_datetime: Optional[DateTimeStr] = None,
        end_datetime: Optional[DateTimeStr] = None,
        limit: int = 100,
        offset: int = 0,
        desc: bool = True,
    ) -> List[FeedingRow]:
        where: List[str] = ["profile_id = ?"]
        params: List[Any] = [profile_id]

        if start_datetime:
            where.append("datetime >= ?")
            params.append(start_datetime)
        if end_datetime:
            where.append("datetime <= ?")
            params.append(end_datetime)

        where_sql = "WHERE " + " AND ".join(where)
        order_sql = "DESC" if desc else "ASC"

        rows = self._conn.execute(
            f"""
            SELECT * FROM feeding
            {where_sql}
            ORDER BY datetime {order_sql}
            LIMIT ? OFFSET ?;
            """,
            (*params, limit, offset),
        ).fetchall()

        return [FeedingRow(**dict(r)) for r in rows]  # type: ignore[misc]

    def update_feeding(
        self,
        feeding_id: FeedingId,
        *,
        datetime: Optional[DateTimeStr] = None,
        amount_ml: Optional[int] = None,
    ) -> None:
        updates: Dict[str, Any] = {}
        if datetime is not None:
            updates["datetime"] = datetime
        if amount_ml is not None:
            updates["amount_ml"] = amount_ml
        if not updates:
            return

        set_clause = ", ".join([f"{k} = ?" for k in updates.keys()])
        params = list(updates.values()) + [feeding_id]
        self._conn.execute(f"UPDATE feeding SET {set_clause} WHERE id = ?;", params)
        self._conn.commit()

    def delete_feeding(self, feeding_id: FeedingId) -> None:
        self._conn.execute("DELETE FROM feeding WHERE id = ?;", (feeding_id,))
        self._conn.commit()

    # -------------------------
    # Diaper CRUD
    # -------------------------
    def create_diaper(self, profile_id: ProfileId, datetime: DateTimeStr, pee: bool, poop: bool) -> DiaperId:
        cur = self._conn.execute(
            "INSERT INTO diaper (profile_id, datetime, pee, poop) VALUES (?, ?, ?, ?);",
            (profile_id, datetime, int(bool(pee)), int(bool(poop))),
        )
        self._conn.commit()
        return int(cur.lastrowid)

    def read_diaper(self, diaper_id: DiaperId) -> Optional[DiaperRow]:
        row = self._conn.execute("SELECT * FROM diaper WHERE id = ?;", (diaper_id,)).fetchone()
        return DiaperRow(**dict(row)) if row else None  # type: ignore[misc]

    def list_diapers(
        self,
        profile_id: ProfileId,
        start_datetime: Optional[DateTimeStr] = None,
        end_datetime: Optional[DateTimeStr] = None,
        limit: int = 100,
        offset: int = 0,
        desc: bool = True,
    ) -> List[DiaperRow]:
        where: List[str] = ["profile_id = ?"]
        params: List[Any] = [profile_id]

        if start_datetime:
            where.append("datetime >= ?")
            params.append(start_datetime)
        if end_datetime:
            where.append("datetime <= ?")
            params.append(end_datetime)

        where_sql = "WHERE " + " AND ".join(where)
        order_sql = "DESC" if desc else "ASC"

        rows = self._conn.execute(
            f"""
            SELECT * FROM diaper
            {where_sql}
            ORDER BY datetime {order_sql}
            LIMIT ? OFFSET ?;
            """,
            (*params, limit, offset),
        ).fetchall()

        return [DiaperRow(**dict(r)) for r in rows]  # type: ignore[misc]

    def update_diaper(
        self,
        diaper_id: DiaperId,
        *,
        datetime: Optional[DateTimeStr] = None,
        pee: Optional[bool] = None,
        poop: Optional[bool] = None,
    ) -> None:
        updates: Dict[str, Any] = {}
        if datetime is not None:
            updates["datetime"] = datetime
        if pee is not None:
            updates["pee"] = int(bool(pee))
        if poop is not None:
            updates["poop"] = int(bool(poop))
        if not updates:
            return

        set_clause = ", ".join([f"{k} = ?" for k in updates.keys()])
        params = list(updates.values()) + [diaper_id]
        self._conn.execute(f"UPDATE diaper SET {set_clause} WHERE id = ?;", params)
        self._conn.commit()

    def delete_diaper(self, diaper_id: DiaperId) -> None:
        self._conn.execute("DELETE FROM diaper WHERE id = ?;", (diaper_id,))
        self._conn.commit()