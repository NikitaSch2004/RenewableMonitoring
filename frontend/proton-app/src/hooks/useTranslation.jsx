import { useLanguage } from "../contexts/LanguageContext";

export function useTranslation(namespace) {
  const { getTranslation } = useLanguage();

  return (key) => getTranslation(`${namespace}.${key}`);
}
