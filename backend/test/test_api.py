import logging
import pytest

from backend.api import Api

logger = logging.getLogger()
logger.setLevel(logging.WARNING)


@pytest.fixture(scope="class")
def api():
    api = Api()
    yield api


@pytest.fixture(scope="class")
def profile_ids(api: Api):
    pid1 = api.create_profile(
        name="예삐",
        birth_date="1999-11-03",
        gender="female",
        photo_path="photos/yebbi.jpg",
    )
    pid2 = api.create_profile(
        name="예삐2",
        birth_date="2000-01-01",
        gender="female",
        photo_path="photos/yebbi2.jpg",
    )
    yield pid1, pid2

    # cleanup (CASCADE로 feeding/diaper도 같이 정리됨)
    # api.delete_profile(pid1)
    # api.delete_profile(pid2)


@pytest.fixture(scope="class")
def feeding_id(api: Api, profile_ids):
    pid1, _ = profile_ids
    fid = api.create_feeding(pid1, "2026-03-03 09:10:00", 120)
    yield fid
    # 기본 cleanup (delete 테스트가 skip이라 남는 데이터 정리)
    # api.delete_feeding(fid)


@pytest.fixture(scope="class")
def diaper_id(api: Api, profile_ids):
    pid1, _ = profile_ids
    did = api.create_diaper(pid1, "2026-03-03 10:05:00", pee=True, poop=False)
    yield did
    # 기본 cleanup (delete 테스트가 skip이라 남는 데이터 정리)
    # api.delete_diaper(did)


class TestCaseApi:
    # -------------------------
    # Profile
    # -------------------------
    def test_profile_create_and_read(self, api: Api, profile_ids):
        pid1, pid2 = profile_ids

        p1 = api.read_profile(pid1)
        p2 = api.read_profile(pid2)

        assert p1 is not None and p1["id"] == pid1 and p1["name"] == "예삐"
        assert p2 is not None and p2["id"] == pid2 and p2["name"] == "예삐2"

        profiles = api.list_profiles(limit=100, offset=0)
        ids = [p["id"] for p in profiles]
        assert pid1 in ids and pid2 in ids

    def test_profile_update(self, api: Api, profile_ids):
        pid1, _ = profile_ids

        resp = api.update_profile(pid1, name="예삐-수정", photo_path="photos/new.jpg")
        logger.warning(f"{self.test_profile_update.__name__} : {resp}")

        p = api.read_profile(pid1)
        assert p is not None
        assert p["name"] == "예삐-수정"
        assert p["photo_path"] == "photos/new.jpg"

    @pytest.mark.skip
    def test_profile_delete(self, api: Api):
        pid = api.create_profile(name="삭제테스트", birth_date="2001-01-01", gender="unknown")
        assert api.read_profile(pid) is not None

        resp = api.delete_profile(pid)
        logger.warning(f"{self.test_profile_delete.__name__} : {resp}")

        assert api.read_profile(pid) is None

    # -------------------------
    # Feeding (Read / Update / Delete 분리)
    # -------------------------
    def test_feeding_read(self, api: Api, feeding_id, profile_ids):
        pid1, _ = profile_ids
        feeding = api.read_feeding(feeding_id)

        assert feeding is not None
        assert feeding["id"] == feeding_id
        assert feeding["profile_id"] == pid1
        assert feeding["datetime"] == "2026-03-03 09:10:00"
        assert feeding["amount_ml"] == 120

    def test_feeding_update(self, api: Api, feeding_id):
        resp = api.update_feeding(feeding_id, amount_ml=130)
        logger.warning(f"{self.test_feeding_update.__name__} update: {resp}")

        feeding2 = api.read_feeding(feeding_id)
        assert feeding2 is not None
        assert feeding2["amount_ml"] == 130

    @pytest.mark.skip
    def test_feeding_delete(self, api: Api, profile_ids):
        pid1, _ = profile_ids
        fid = api.create_feeding(pid1, "2026-03-03 09:11:00", 50)
        assert api.read_feeding(fid) is not None

        resp = api.delete_feeding(fid)
        logger.warning(f"{self.test_feeding_delete.__name__} delete: {resp}")

        assert api.read_feeding(fid) is None

    def test_feeding_list_with_filters_and_profile_scope(self, api: Api, profile_ids):
        pid1, pid2 = profile_ids

        f1 = api.create_feeding(pid1, "2026-03-03 08:00:00", 80)
        f2 = api.create_feeding(pid1, "2026-03-03 10:00:00", 100)
        f3 = api.create_feeding(pid1, "2026-03-03 12:00:00", 120)
        f_other = api.create_feeding(pid2, "2026-03-03 10:30:00", 999)

        items_range = api.list_feedings(
            pid1,
            start_datetime="2026-03-03 09:00:00",
            end_datetime="2026-03-03 12:00:00",
            limit=100,
            desc=False,
        )
        dts = [x["datetime"] for x in items_range]
        assert "2026-03-03 10:00:00" in dts
        assert "2026-03-03 12:00:00" in dts
        assert "2026-03-03 08:00:00" not in dts
        assert "2026-03-03 10:30:00" not in dts
        assert all(x["profile_id"] == pid1 for x in items_range)
        #
        # api.delete_feeding(f1)
        # api.delete_feeding(f2)
        # api.delete_feeding(f3)
        # api.delete_feeding(f_other)

    # -------------------------
    # Diaper (Read / Update / Delete 분리)
    # -------------------------
    def test_diaper_read(self, api: Api, diaper_id, profile_ids):
        pid1, _ = profile_ids
        diaper = api.read_diaper(diaper_id)

        assert diaper is not None
        assert diaper["id"] == diaper_id
        assert diaper["profile_id"] == pid1
        assert diaper["datetime"] == "2026-03-03 10:05:00"
        assert diaper["pee"] == 1
        assert diaper["poop"] == 0

    def test_diaper_update(self, api: Api, diaper_id):
        resp = api.update_diaper(diaper_id, poop=True)
        logger.warning(f"{self.test_diaper_update.__name__} update: {resp}")

        diaper2 = api.read_diaper(diaper_id)
        assert diaper2 is not None
        assert diaper2["poop"] == 1

    @pytest.mark.skip
    def test_diaper_delete(self, api: Api, profile_ids):
        pid1, _ = profile_ids
        did = api.create_diaper(pid1, "2026-03-03 10:06:00", pee=True, poop=False)
        assert api.read_diaper(did) is not None

        resp = api.delete_diaper(did)
        logger.warning(f"{self.test_diaper_delete.__name__} delete: {resp}")

        assert api.read_diaper(did) is None

    def test_diaper_list_with_filters_and_profile_scope(self, api: Api, profile_ids):
        pid1, pid2 = profile_ids

        d1 = api.create_diaper(pid1, "2026-03-03 07:00:00", pee=True, poop=False)
        d2 = api.create_diaper(pid1, "2026-03-03 11:00:00", pee=True, poop=True)
        d3 = api.create_diaper(pid1, "2026-03-03 13:00:00", pee=False, poop=True)
        d_other = api.create_diaper(pid2, "2026-03-03 11:30:00", pee=True, poop=True)

        items_range = api.list_diapers(
            pid1,
            start_datetime="2026-03-03 10:00:00",
            end_datetime="2026-03-03 13:00:00",
            limit=100,
            desc=False,
        )
        dts = [x["datetime"] for x in items_range]
        assert "2026-03-03 11:00:00" in dts
        assert "2026-03-03 13:00:00" in dts
        assert "2026-03-03 07:00:00" not in dts
        assert "2026-03-03 11:30:00" not in dts
        assert all(x["profile_id"] == pid1 for x in items_range)

        # api.delete_diaper(d1)
        # api.delete_diaper(d2)
        # api.delete_diaper(d3)
        # api.delete_diaper(d_other)


if __name__ == "__main__":
    pytest.main(["-x", __file__])