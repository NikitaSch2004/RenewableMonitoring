import FilesList from "./FilesList";
import filesListUrl from "../../assets/filesList.svg";
import { useFiles } from "../../hooks/useFiles";
import { useTranslation } from "../../hooks/useTranslation";

export default function FilesDashboard() {
  const { filesList, loading, isAdmin } = useFiles();
  const t = useTranslation("filesDashboard"); // namespace

  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-200 w-full">
      <div className="px-1 sm:px-4 py-2 sm:py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-[14px] sm:text-lg font-semibold text-gray-900">
          {t("title")}
        </h2>
        <p className="text-gray-500 text-sm">
          {t("desc")}
        </p>
      </div>

      <div className="p-4">
        <div className="max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg">
          {!loading && filesList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <img src={filesListUrl} alt={t("altText")} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t("emptyTitle")}
              </h3>
              <p className="text-gray-500 text-center max-w-sm">
                {t("emptyDesc")}
              </p>
            </div>
          ) : (
            <FilesList
              filesList={filesList}
              loading={loading}
              isAdmin={isAdmin}
            />
          )}
        </div>
      </div>
    </div>
  );
}