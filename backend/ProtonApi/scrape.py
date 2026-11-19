import requests
import time
import re


def get_session_id_from_page(session, cookie_value):
    """
    Получает настоящий session_id из HTML страницы после авторизации

    Args:
        session (requests.Session): Сессия с установленными cookies
        cookie_value (str): Значение cookie IW__PS_Atlas_Web_interface

    Returns:
        str: Настоящий session_id для AJAX запросов
    """
    try:
        # Запрашиваем главную страницу для получения session_id
        response = session.get("https://REDACTED/", timeout=30)

        # Ищем session_id в HTML коде
        # Обычно он находится в JavaScript или в скрытых полях формы
        session_id_patterns = [
            r'IW_SessionID_["\']?\s*[:=]\s*["\']?([^"\';\s]+)',
            r'sessionid["\']?\s*[:=]\s*["\']?([^"\';\s]+)',
            r'IW_SessionID_["\']?\s*=\s*["\']?([^"\';\s]+)',
            r'name=["\']IW_SessionID_["\'][^>]*value=["\']([^"\']+)',
        ]

        for pattern in session_id_patterns:
            match = re.search(pattern, response.text, re.IGNORECASE)
            if match:
                return match.group(1)

        print("Session ID не найден в HTML. Попробуем использовать cookie value...")
        return cookie_value

    except Exception as e:
        print(f"Ошибка при получении session_id: {e}")
        return cookie_value


def full_authorization_flow():
    """
    Полный процесс авторизации и получения корректного session_id

    Returns:
        tuple: (session, session_id) для дальнейшего использования
    """
    session = requests.Session()

    url1 = "https://REDACTED/"
    params1 = {
        "IWEDITUSER": "REDACTED",
        "IWEDITPASSWORD": "REDACTED",
    }

    response = session.post(url1, data=params1)
    _ = session.get("https://REDACTED/", timeout=30)

    # Получаем cookie после авторизации
    cookie_value = None
    for cookie in session.cookies:
        if cookie.name == "IW__PS_Atlas_Web_interface":
            cookie_value = cookie.value
            break

    if not cookie_value:
        print("Cookie IW__PS_Atlas_Web_interface не найден")
        return None, None

    print(f"Получен cookie: {cookie_value}")

    # Получаем настоящий session_id из HTML страницы
    session_id = get_session_id_from_page(session, cookie_value)
    print(f"Session ID для AJAX: {session_id}")

    return session, session_id


def simulate_ajax_request(session_id, track_id=None, session_obj=None):
    """
    Симулирует AJAX GET запрос к REDACTED

    Args:
        session_id (str): ID сессии для AJAX запросов
        track_id (int, optional): ID трека, по умолчанию генерируется случайно
        session_obj (requests.Session, optional): Сессия с cookies от авторизации

    Returns:
        requests.Response: Ответ сервера
    """

    # Используем переданную сессию или создаем новую
    if session_obj:
        session = session_obj
    else:
        session = requests.Session()

    # URL для запроса
    url = "https://REDACTED/$/callback"

    # Генерируем track_id если не передан
    if track_id is None:
        track_id = 29  # Используем значение из примера или генерируем

    # Генерируем ajax_id (похоже на timestamp)
    ajax_id = int(time.time() * 1000)

    # Параметры URL (все параметры из GET запроса)
    params = {
        'callback': 'IWTIMER30SEC.DoOnAsyncTimer',
        'IW_Timer_': '',
        'IW_TrackID_': str(track_id),
        'IW_SessionID_': session_id,
        'IW_height': '1704',
        'IW_width': '980',
        'IW_FormClass': 'TIWFormMain_Overview',
        'IW_FormName': 'IWFormMain_Overview',
        'IW_AjaxID': str(ajax_id),
    }

    # Заголовки (адаптированы для Python requests)
    headers = {
        'Accept': '*/*',
        'Accept-Language': 'ru,en;q=0.9,ro;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
        'Referer': 'https://REDACTED/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
    }

    try:
        # Выполняем GET запрос
        response = session.get(
            url,
            params=params,
            headers=headers,
            timeout=30
        )

        return response

    except requests.exceptions.RequestException as e:
        print(f"Ошибка при выполнении запроса: {e}")
        return None


# Пример использования
def main():
    print("ВАРИАНТ С ПОЛУЧЕНИЕМ SESSION_ID")
    #Полный процесс авторизации
    session, session_id = full_authorization_flow()

    if session and session_id:
        # Используем полученную сессию и session_id
        response = simulate_ajax_request(session_id, session_obj=session)

        if response:
            print(f"Статус код: {response.status_code}")
            print(f"Содержимое ответа: {response.text}")
            print("-" * 50)
        else:
            print("Не удалось выполнить")
    else:
        print("Не удалось получить session_id после авторизации")

    print("ВАРИАНТ С SESSION_ID ВЗЯТЫМ ИЗ КУКИ В БРАУЗЕРЕ ВРУЧНУЮ")
    test_with_existing_cookie()




def test_with_existing_cookie():
    """
    Тестирует запрос с уже имеющимся cookie value
    """
    # Замените на актуальный cookie value
    cookie_value = "REDACTED"  # Обновите на актуальный

    # Создаем сессию и устанавливаем cookie
    session = requests.Session()
    session.cookies.set('IW__PS_Atlas_Web_interface', cookie_value, domain='REDACTED')

    # Используем cookie value как session_id (так как поиск в HTML не работает)
    session_id = cookie_value

    # Выполняем запрос
    response = simulate_ajax_request(session_id, session_obj=session)

    if response:
        print(f"Статус код: {response.status_code}")
        print(f"Содержимое ответа: {response.text}")
        return True
    else:
        print("Не удалось выполнить запрос")
        return False
def parse_xml_response(response_text):
    """
    Парсит XML ответ от сервера
    """
    try:
        import xml.etree.ElementTree as ET
        root = ET.fromstring(response_text)

        result = {}
        for child in root:
            result[child.tag] = child.text

        return result
    except Exception as e:
        print(f"Ошибка парсинга XML: {e}")
        return None


if __name__ == "__main__":
    main()