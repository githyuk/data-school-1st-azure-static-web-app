from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="세이프 패스 API 서버")

# 보안 설정 (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Azure DB 접속 정보
DB_CONFIG = {
    "host": "team4-db.postgres.database.azure.com",
    "database": "postgres",
    "user": "azure_root",
    "password": "qwer1234!",
    "port": "5432",
    "sslmode": "require"
}

# --- 데이터 모델 ---
class UserSignup(BaseModel):
    userid: str
    password: str
    name: str
    birthyear: int
    address: str

class UserLogin(BaseModel):
    userid: str
    password: str

# --- 기존 로그인/회원가입 API ---
@app.post("/api/signup")
def create_user(user: UserSignup):
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        query = "INSERT INTO users (userid, password, name, address, birthyear) VALUES (%s, %s, %s, %s, %s)"
        cur.execute(query, (user.userid, user.password, user.name, user.address, user.birthyear))
        conn.commit()
        return {"status": "success", "message": f"환영합니다, {user.name}님! 가입 완료."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'conn' in locals(): cur.close(); conn.close()

@app.post("/api/login")
def login_user(user: UserLogin):
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute("SELECT password, name FROM users WHERE userid = %s", (user.userid,))
        result = cur.fetchone()
        
        if result is None:
            raise HTTPException(status_code=400, detail="아이디가 없습니다.")
        if result[0] != user.password:
            raise HTTPException(status_code=400, detail="비밀번호가 틀렸습니다.")
            
        return {"status": "success", "message": f"{result[1]}님 환영합니다!", "username": result[1]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'conn' in locals(): cur.close(); conn.close()

# --- [NEW] 쉼터 데이터 가져오기 API ---
@app.get("/api/shelters")
def get_shelters():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        # 무더위 쉼터와 한파 쉼터를 합쳐서 가져옵니다.
        query = """
            SELECT shelter_name, lat, lon FROM heat_shelter
            UNION ALL
            SELECT shelter_name, lat, lon FROM cold_shelter
        """
        cur.execute(query)
        rows = cur.fetchall()
        
        # 프론트엔드가 쓰기 좋게 JSON 리스트로 변환
        shelters = []
        for row in rows:
            shelters.append({
                "name": row[0],
                "lat": float(row[1]),
                "lng": float(row[2])
            })
        return shelters
    except Exception as e:
        print(f"DB 에러: {e}")
        return [] # 에러나면 빈 리스트 반환
    finally:
        if 'conn' in locals(): cur.close(); conn.close()
