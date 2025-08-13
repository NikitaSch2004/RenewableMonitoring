import imaplib
import email
import os
import pandas as pd
from datetime import datetime
import json
import traceback
import re
import locale

"""
Receive and parse forecast data from the mail
which is then registered in the db.
"""


class Facility:
    def __init__(self, lFacility):
        facilityInfo = lFacility.split("|")
        self.id = facilityInfo[0]
        self.type = facilityInfo[2]
        self.lFacility = {"NA": "", "EX": "", "PE": ""}
        self.values = {"NA": [], "EX": [], "PE": []}

    def valueTotal(self):
        return [sum(x) for x in zip(self.values["NA"], self.values["EX"], self.values["PE"])]


class ExcelParsing:
    def __init__(self, filepath):
        self.df = pd.read_excel(filepath)
        self.facilities = []

    def getAllData(self):
        columns = list(self.df.columns)
        lYear, lMonth, lDay, lHour = columns[:4]

        # убираем TOTAL и делим на группы
        data_cols = [col for col in columns[4:] if "TOTAL" not in col]
        n = len(data_cols) // 3
        na_cols, ex_cols, pe_cols = data_cols[:n], data_cols[n:2 * n], data_cols[2 * n:]

        for i in range(n):
            facility = Facility(na_cols[i])
            facility.lFacility["NA"] = na_cols[i]
            facility.lFacility["EX"] = ex_cols[i]
            facility.lFacility["PE"] = pe_cols[i]

            for j in range(24):
                facility.values["NA"].append(self.df.at[j, na_cols[i]])
                facility.values["EX"].append(self.df.at[j, ex_cols[i]])
                facility.values["PE"].append(self.df.at[j, pe_cols[i]])

            self.facilities.append(facility)

        return {
            "year": self.df.at[0, lYear],
            "month": self.df.at[0, lMonth],
            "day": self.df.at[0, lDay],
            "data": [{"id": f.id, "type": f.type, "values": f.valueTotal()} for f in self.facilities]
        }


class EmailExcelProcessor:
    def __init__(self, email_address, password, imap_server="REDACTED", imap_port=993):
        self.email_address = email_address
        self.password = password
        self.imap_server = imap_server
        self.imap_port = imap_port
        self.mail = None

    def connect(self):
        try:
            self.mail = imaplib.IMAP4_SSL(self.imap_server, self.imap_port)
            status, _ = self.mail.login(self.email_address, self.password)
            if status != "OK":
                raise ConnectionError("Не удалось войти в почтовый ящик")
            print("Подключение к IMAP прошло успешно")
        except Exception as e:
            print(f"Ошибка подключения к IMAP: {e}")
            self.mail = None

    def search_today_excel(self):
        if not self.mail:
            print("Нет активного соединения с IMAP")
            return []

        self.mail.select("INBOX")
        locale.setlocale(locale.LC_TIME, 'C')
        today_str = datetime.today().strftime("%d-%b-%Y")
        status, messages = self.mail.search(None, f'(ON "{today_str}")')

        if status != "OK":
            print(f"Ошибка поиска писем за {today_str}")
            return []

        email_ids = messages[0].split()
        excel_emails = []

        for email_id in email_ids:
            status, msg_data = self.mail.fetch(email_id, "(RFC822)")
            if status != "OK":
                print(f"Ошибка получения письма {email_id}")
                continue
            email_message = email.message_from_bytes(msg_data[0][1])
            for part in email_message.walk():
                if part.get_content_disposition() == "attachment":
                    filename = part.get_filename()
                    if filename and filename.endswith(('.xlsx', '.xls')):
                        excel_emails.append((email_id, email_message))
                        break
        return excel_emails

    def download_and_parse(self, excel_emails, folder="excel_files"):
        if not os.path.exists(folder):
            os.makedirs(folder)

        results = []
        processed_files_count = 0  # Счетчик обработанных файлов

        for email_id, email_message in excel_emails:
            for part in email_message.walk():
                if part.get_content_disposition() == "attachment":
                    filename = part.get_filename()
                    if filename and filename.endswith(('.xlsx', '.xls')):
                        if re.search(r"\d{4}-\d{2}-\d{2}\s*-\s*\d{4}-\d{2}-\d{2}", filename):
                            print(f"Пропущен месячный прогноз: {filename}")
                            continue

                        # Увеличиваем счетчик только для файлов, которые не пропускаем
                        processed_files_count += 1

                        filepath = os.path.join(folder, filename)
                        with open(filepath, "wb") as f:
                            f.write(part.get_payload(decode=True))
                        parser = ExcelParsing(filepath)
                        results.append(parser.getAllData())
                        os.remove(filepath)

        return results, processed_files_count

    def disconnect(self):
        self.mail.close()
        self.mail.logout()


def main():
    EMAIL = "REDACTED"
    PASSWORD = "REDACTED"

    processor = EmailExcelProcessor(EMAIL, PASSWORD)
    processor.connect()

    flag = {"status": "400", "data": "none"}
    try:
        excel_emails = processor.search_today_excel()
        if not excel_emails:
            print("Сегодня писем с Excel не найдено")
            flag = {"status": "404", "data": "Писем с Excel файлами не найдено"}
        else:
            data, processed_count = processor.download_and_parse(excel_emails)

            if processed_count == 0:
                print("Все найденные файлы были пропущены (месячные прогнозы)")
                flag = {"status": "404", "data": "Подходящих файлов не найдено (все файлы - месячные прогнозы)"}
            elif len(data) == 0:
                print("Файлы были обработаны, но данных не получено")
                flag = {"status": "500", "data": "Ошибка обработки файлов"}
            else:
                print(f"Успешно обработано {len(data)} файлов")
                flag = {"status": "200", "data": data}

    except Exception as e:
        print("Ошибка:", e)
        print("Трасебэк", traceback.format_exc())
        flag = {"status": "500", "data": f"Ошибка обработки: {str(e)}"}
    finally:
        processor.disconnect()
        return flag


if __name__ == "__main__":
    result = main()
    print(json.dumps(result, indent=2, ensure_ascii=False))