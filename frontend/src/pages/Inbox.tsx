import Sidebar from "../components/layout/Sidebar";
import EmailList from "../components/layout/EmailList";

export default function Inbox() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <EmailList />
    </div>
  );
}
