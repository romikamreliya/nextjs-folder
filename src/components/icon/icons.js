import { Icon } from "@iconify/react";

const createIcon = (iconName) => {
    const IconComponent = (props) => <Icon icon={iconName} {...props} />;
    IconComponent.displayName = `Icon(${iconName})`;
    return IconComponent;
};

export const Eye = createIcon("solar:eye-bold-duotone");
export const EyeOff = createIcon("solar:eye-closed-bold-duotone");
export const Mail = createIcon("solar:letter-bold-duotone");
export const Lock = createIcon("solar:lock-password-bold-duotone");
export const LayoutTemplate = createIcon("solar:widget-5-bold-duotone");

// Sidebar icons
export const LayoutDashboard = createIcon("solar:widget-5-bold-duotone");
export const BarChart2 = createIcon("solar:chart-square-bold-duotone");
export const Calendar = createIcon("solar:calendar-bold-duotone");
export const FileText = createIcon("solar:document-text-bold-duotone");
export const DollarSign = createIcon("solar:wad-of-money-bold-duotone");
export const Users = createIcon("solar:users-group-two-rounded-bold-duotone");
export const Briefcase = createIcon("solar:case-bold-duotone");
export const ShoppingCart = createIcon("solar:cart-large-bold-duotone");
export const Package = createIcon("solar:box-bold-duotone");
export const Factory = createIcon("solar:buildings-2-bold-duotone");
export const FolderOpen = createIcon("solar:folder-open-bold-duotone");
export const Folder = createIcon("solar:folder-bold-duotone");
export const Monitor = createIcon("solar:monitor-bold-duotone");
export const Settings = createIcon("solar:settings-bold-duotone");
export const Headphones = createIcon("solar:headphones-round-sound-bold-duotone");
export const Hexagon = createIcon("solar:box-minimalistic-bold-duotone");
export const Close = createIcon("solar:close-circle-bold-duotone");
export const Widget = createIcon("solar:widget-bold-duotone");
export const Chart2 = createIcon("solar:chart-2-bold-duotone");
export const ShieldUser = createIcon("solar:shield-user-bold-duotone");
export const Shop = createIcon("solar:shop-2-bold-duotone");
export const Box = createIcon("solar:box-bold-duotone");
export const Tag = createIcon("solar:tag-bold-duotone");
export const Star = createIcon("solar:star-bold-duotone");
export const VerifiedCheck = createIcon("solar:verified-check-bold-duotone");
export const Buildings = createIcon("solar:buildings-bold-duotone");
export const List = createIcon("solar:list-bold-duotone");


// Topbar icons
export const Search = createIcon("solar:magnifer-bold-duotone");
export const Bell = createIcon("solar:bell-bing-bold-duotone");
export const Globe = createIcon("solar:earth-bold-duotone");
export const Sun = createIcon("solar:sun-bold-duotone");
export const Moon = createIcon("solar:moon-stars-bold-duotone");
export const HamburgerMenu = createIcon("solar:hamburger-menu-linear");
export const ArrowRightFromSquare = createIcon("solar:logout-2-bold-duotone");
export const Gear = createIcon("solar:settings-bold-duotone");
export const Persons = createIcon("solar:users-group-rounded-bold-duotone");
export const UserPending = createIcon("solar:user-speak-rounded-bold-duotone");

// card icons
export const UsersGroup = createIcon("solar:users-group-rounded-bold-duotone");
export const UserCheck = createIcon("solar:user-check-bold-duotone");
export const UserHandshake = createIcon("solar:user-handshake-bold-duotone");
export const UserBlock = createIcon("solar:user-block-bold-duotone");


// Table icons
export const UserPlus = createIcon("solar:user-plus-bold-duotone");
export const Filter = createIcon("solar:filter-bold-duotone");
export const AltArrowUp = createIcon("solar:alt-arrow-up-linear");
export const AltArrowDown = createIcon("solar:alt-arrow-down-linear");
export const AltArrowRight = createIcon("solar:alt-arrow-right-linear");
export const AltArrowLeft = createIcon("solar:alt-arrow-left-linear");
export const ArrowLeftDuotone = createIcon("solar:arrow-left-bold-duotone");
export const Columns = createIcon("solar:widget-4-bold-duotone");
export const Pen = createIcon("solar:pen-bold-duotone");
export const Trash = createIcon("solar:trash-bin-trash-bold-duotone");
export const Clock = createIcon("solar:clock-circle-bold-duotone");
export const Archive = createIcon("solar:archive-bold-duotone");
export const TableUser = createIcon("solar:user-bold-duotone");
export const MenuDots = createIcon("solar:tuning-2-bold-duotone");
export const StatusPending = createIcon("solar:clock-circle-bold-duotone");
export const ForbiddenCircle = createIcon("solar:close-circle-bold-duotone");
export const EmptyInfo = createIcon("solar:info-circle-linear");

// user profile icons
export const User = createIcon("solar:user-bold-duotone");
export const Phone = createIcon("solar:phone-bold-duotone");
export const Camera = createIcon("solar:camera-bold-duotone");
export const Plus = createIcon("ic:round-plus");
export const Code = createIcon("solar:code-square-bold-duotone");
export const SaveIcon = createIcon("solar:diskette-bold-duotone");

// Document icons
export const Upload = createIcon("solar:upload-bold-duotone");
export const Download = createIcon("solar:download-bold-duotone");
export const FilePdf = createIcon("solar:file-text-bold-duotone");
export const IconPdf = createIcon("solar:file-download-bold-duotone");
export const IconXls = createIcon("solar:document-text-bold-duotone");
export const Gallery = createIcon("solar:gallery-bold-duotone");
export const LinkIcon = createIcon("solar:link-bold-duotone");
export const WarningCircle = createIcon("solar:danger-circle-bold-duotone");
export const CheckCircle = createIcon("solar:check-circle-bold-duotone");
export const Clipboard = createIcon("solar:clipboard-list-bold-duotone");
export const AdjustmentIcon = createIcon("solar:graph-new-up-bold-duotone");
export const PostCheck = createIcon("solar:bill-check-bold-duotone");
export const Bill = createIcon("solar:bill-list-bold-duotone");
export const CardSend = createIcon("solar:card-send-bold-duotone");
export const ImportCsv = createIcon("solar:import-bold-duotone");
export const PrintIcon = createIcon("solar:printer-minimalistic-bold-duotone");
export const InfoCircle = createIcon("solar:info-circle-bold-duotone");
export const MinusCircle = createIcon("solar:minus-circle-bold-duotone");
export const PlusCircle = createIcon("solar:add-circle-bold-duotone");
export const SerialIcon = createIcon("solar:sort-by-time-bold-duotone");
export const ReturnIcon = createIcon("solar:undo-left-round-bold-duotone");
export const CreditNoteIcon = createIcon("solar:document-add-bold-duotone");
export const StockMovementIcon = createIcon("solar:graph-up-bold-duotone");

export const Check = createIcon("solar:check-square-bold-duotone");
export const Copy = createIcon("solar:copy-bold-duotone");
export const Sparkles = createIcon("solar:magic-stick-3-bold-duotone");

