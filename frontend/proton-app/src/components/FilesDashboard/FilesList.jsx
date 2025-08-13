import { useState } from "react";
import {
    FileText,
    File,
    Image,
    Video,
    Music,
    Archive,
    Code,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Mail
} from 'lucide-react';

export default function FilesList({loading, filesList}) {
    const [expandedItems, setExpandedItems] = useState(new Set());

    /* const fileList = [
        {
            id: 1,
            name: "Invoice 1",
            type: "pdf",
            size: "2.3 MB",
            date: "18/07/2025",
            link: "https://example.com/invoice1.pdf"
        },
        {
            id: 2,
            name: "Proforma Invoice",
            type: "pdf",
            size: "1.8 MB",
            date: "17/07/2025",
            link: "https://example.com/proforma.pdf"
        },
        {
            id: 3,
            name: "Certificate of Compliance",
            type: "pdf",
            size: "895 KB",
            date: "16/07/2025",
            link: "https://example.com/certificate.pdf"
        },
        {
            id: 4,
            name: "Certificate of Compliance",
            type: "docx",
            size: "1.2 MB",
            date: "16/07/2025",
            link: "https://example.com/certificate.docx"
        },
        {
            id: 5,
            name: "Warranty Letter",
            type: "pdf",
            size: "645 KB",
            date: "15/07/2025",
            link: "https://example.com/warranty.pdf"
        },
        {
            id: 6,
            name: "Product Images",
            type: "zip",
            size: "15.4 MB",
            date: "14/07/2025",
            link: "https://example.com/images.zip"
        },
        {
            id: 7,
            name: "Installation Video",
            type: "mp4",
            size: "48.7 MB",
            date: "13/07/2025",
            link: "https://example.com/video.mp4"
        }
    ]; */

    console.log("FilesList component rendered with files:", filesList);

    const getFileIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'pdf':
                return <FileText className="text-red-600" size={24} />;
            case 'docx':
            case 'doc':
                return <File className="text-blue-600" size={24} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <Image className="text-green-600" size={24} />;
            case 'mp4':
            case 'avi':
            case 'mov':
                return <Video className="text-purple-600" size={24} />;
            case 'mp3':
            case 'wav':
                return <Music className="text-orange-600" size={24} />;
            case 'zip':
            case 'rar':
                return <Archive className="text-yellow-600" size={24} />;
            case 'js':
            case 'html':
            case 'css':
                return <Code className="text-gray-600" size={24} />;
            default:
                return <File className="text-gray-600" size={24} />;
        }
    };

    const toggleExpanded = (itemId) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId);
        } else {
            newExpanded.add(itemId);
        }
        setExpandedItems(newExpanded);
    };

    const handleFileClick = (link) => {
        window.open(link, '_blank');
    };

    return (
        <div className="p-4 space-y-3">
            {filesList.map((item) => (
                <div
                    key={item.id}
                    className="bg-gray-100 rounded-xl shadow transition-all duration-200"
                >
                    {/* Основной элемент списка */}
                    <div
                        className="flex flex-row p-3 gap-3 items-center cursor-pointer hover:bg-gray-150"
                        onClick={() => toggleExpanded(item.id)}
                    >
                        {/* Иконка письма и название */}
                        <div className="bg-gray-200 px-3 py-2 rounded-lg font-semibold text-sm md:text-base min-h-[2.5rem] flex items-center gap-2 flex-grow min-w-0">
                            <Mail size={20} className="text-yellow-500 flex-shrink-0" />
                            <span className="truncate">{item.name}</span>
                        </div>

                        {/* Кнопка раскрытия */}
                        <div className="flex justify-center flex-shrink-0">
                            <div className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                                {expandedItems.has(item.id) ? (
                                    <ChevronUp size={20} className="text-gray-600" />
                                ) : (
                                    <ChevronDown size={20} className="text-gray-600" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Расширенная информация */}
                    {expandedItems.has(item.id) && (
                        <div className="px-3 pb-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-lg shadow-sm">
                                        {getFileIcon(item.type)}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                                        <p className="text-sm text-gray-600">Date: {item.date}</p>
                                        <p className="text-sm text-gray-600">Type: {item.type.toUpperCase()}</p>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFileClick(item.link);
                                    }}
                                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                                    title="Open file"
                                >
                                    <ExternalLink size={16} />
                                    Open File
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}