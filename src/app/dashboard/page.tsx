"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Mail,
  FolderKanban,
  Settings,
  Database,
  LogOut,
  Upload,
  Image as ImageIcon,
  Pencil,
  X,
  Check,
  Globe,
} from "lucide-react";
import Image from "next/image";

type Toast = { type: "success" | "error"; text: string } | null;

const emptyProject = {
  index: "04",
  title: "",
  category: "Power Systems",
  year: "2025",
  client: "",
  image: "",
  description: "",
  fullDescription: "",
  gallery: [] as string[],
};

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"projects" | "messages" | "settings">("projects");
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [aboutSettings, setAboutSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyProject });
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingPortrait, setUploadingPortrait] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, msgRes, aboutRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/messages"),
        fetch("/api/about"),
      ]);
      const projData = await projRes.json();
      const msgData = await msgRes.json();
      const aboutData = await aboutRes.json();
      if (Array.isArray(projData)) setProjects(projData);
      if (Array.isArray(msgData)) setMessages(msgData); else setMessages([]);
      if (aboutData?.headlineMain) setAboutSettings(aboutData);
    } catch {
      showToast("error", "Failed to load dashboard data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------- LOGOUT HANDLER ----------
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      showToast("success", "Logged out successfully");
      setTimeout(() => {
        router.push("/dashboard/login");
      }, 500);
    } catch {
      showToast("error", "Logout failed");
    }
  };

  // ---------- UPLOAD HELPERS ----------
  const uploadFiles = async (files: FileList | File[]) => {
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.urls as string[];
  };

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    try {
      const urls = await uploadFiles([file]);
      setForm((p) => ({ ...p, image: urls[0] }));
      showToast("success", "Cover image uploaded");
    } catch (err: any) {
      showToast("error", err.message);
    }
    setUploadingMain(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadingGallery(true);
    try {
      const urls = await uploadFiles(files);
      setForm((p) => ({ ...p, gallery: [...p.gallery, ...urls] }));
      showToast("success", `${urls.length} gallery images uploaded`);
    } catch (err: any) {
      showToast("error", err.message);
    }
    setUploadingGallery(false);
  };

  const handlePortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPortrait(true);
    try {
      const urls = await uploadFiles([file]);
      if (urls[0]) {
        setAboutSettings((prev: any) => ({ ...prev, portraitImage: urls[0] }));
        showToast("success", "Portrait image uploaded");
      }
    } catch (err: any) {
      showToast("error", err.message || "Upload failed");
    }
    setUploadingPortrait(false);
  };

  // ---------- CRUD ACTIONS ----------
  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyProject });
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditingId(p._id);
    setForm({
      index: p.index || "",
      title: p.title || "",
      category: p.category || "",
      year: p.year || "",
      client: p.client || "",
      image: p.image || "",
      description: p.description || "",
      fullDescription: p.fullDescription || "",
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
    });
    setShowModal(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) {
      showToast("error", "Please upload a main cover image");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      showToast("success", editingId ? "Project updated" : "Project created");
      setShowModal(false);
      setEditingId(null);
      setForm({ ...emptyProject });
      fetchData();
    } catch (err: any) {
      showToast("error", err.message);
    }
    setSaving(false);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      showToast("success", "Project deleted");
      setConfirmDeleteId(null);
      fetchData();
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("success", "Message deleted");
      fetchData();
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const handleSeed = async () => {
    try {
      const res = await fetch("/api/seed");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seed failed");
      showToast("success", "Database seeded");
      fetchData();
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aboutSettings),
      });
      if (!res.ok) throw new Error("Settings save failed");
      showToast("success", "Settings saved to MongoDB");
      fetchData();
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white p-6 md:p-12 font-mono selection:bg-amber-400 selection:text-black relative">
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] px-5 py-3 text-xs uppercase tracking-widest border shadow-2xl flex items-center gap-3 animate-fadeIn ${
            toast.type === "success"
              ? "bg-emerald-950 border-emerald-500/50 text-emerald-300"
              : "bg-red-950 border-red-500/50 text-red-300"
          }`}
        >
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {toast.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8 pt-12">
          <div>
            <span className="text-xs text-amber-400 uppercase tracking-widest block mb-1">
              // CONTROL CENTER
            </span>
            <h1 className="text-3xl md:text-4xl font-serif uppercase tracking-tight">
              ADMIN DASHBOARD
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSeed}
              className="flex items-center gap-2 text-xs border border-amber-400/40 text-amber-400 px-4 py-2 hover:bg-amber-400 hover:text-black transition-colors"
            >
              <Database className="w-3.5 h-3.5" /> SEED MONGODB
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors text-zinc-300"
            >
              <Globe className="w-3.5 h-3.5" /> VIEW SITE
            </a>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs bg-red-950/60 border border-red-800/60 text-red-300 px-4 py-2 hover:bg-red-600 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> LOGOUT
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-4 border-b border-white/10 pb-4">
          {(
            [
              ["projects", <FolderKanban key="p" className="w-4 h-4" />, `PROJECTS (${projects.length})`],
              ["messages", <Mail key="m" className="w-4 h-4" />, `INBOX (${messages.length})`],
              ["settings", <Settings key="s" className="w-4 h-4" />, "SYSTEM SETTINGS"],
            ] as const
          ).map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${
                activeTab === key
                  ? "bg-amber-400 text-black border-amber-400 font-bold"
                  : "border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* ================= TABS CONTENT ================= */}

        {/* 1. PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-serif uppercase">PROJECT ARCHIVE</h2>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 text-xs bg-white text-black px-4 py-2 uppercase tracking-wider font-bold hover:bg-amber-400 transition-colors"
              >
                <Plus className="w-4 h-4" /> ADD NEW PROJECT
              </button>
            </div>
            {loading ? (
              <div className="text-xs text-zinc-500">LOADING DATABASE...</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {projects.map((p) => (
                  <div
                    key={p._id}
                    className="bg-[#0c0c0c] border border-white/10 p-6 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-amber-400/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {p.image && (
                        <div className="relative w-16 h-12 bg-zinc-900 border border-white/10 overflow-hidden shrink-0">
                          <Image src={p.image} alt={p.title} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] text-amber-400 block mb-1">
                          INDEX: {p.index} // {p.category} ({p.year})
                        </span>
                        <h3 className="text-xl font-serif text-white">{p.title}</h3>
                        <p className="text-xs text-zinc-500 max-w-xl mt-1 line-clamp-1">{p.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 border border-white/20 text-zinc-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
                        title="Edit Project"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {confirmDeleteId === p._id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteProject(p._id)}
                            className="px-3 py-2 text-[10px] bg-red-600 text-white uppercase tracking-wider hover:bg-red-500"
                          >
                            CONFIRM
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-2 text-[10px] border border-white/20 text-zinc-400 uppercase tracking-wider hover:text-white"
                          >
                            CANCEL
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(p._id)}
                          className="p-2 border border-red-900/50 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. MESSAGES TAB */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <h2 className="text-xl font-serif uppercase">INCOMING TRANSMISSIONS</h2>
            {loading ? (
              <div className="text-xs text-zinc-500">LOADING INBOX...</div>
            ) : messages.length === 0 ? (
              <div className="text-xs text-zinc-500 bg-[#0c0c0c] p-8 border border-white/10 text-center">
                NO TRANSMISSIONS LOGGED YET.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {messages.map((m) => (
                  <div
                    key={m._id}
                    className="bg-[#0c0c0c] border border-white/10 p-6 rounded-sm space-y-3 relative group hover:border-amber-400/30 transition-colors"
                  >
                    {/* Delete Message Button */}
                    <button
                      onClick={() => handleDeleteMessage(m._id)}
                      className="absolute top-4 right-4 p-2 bg-red-950/50 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all rounded-sm"
                      title="Delete Transmission"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex justify-between items-center text-xs text-amber-400 border-b border-white/10 pb-3 pr-12">
                      <span>FROM: {m.name} ({m.email})</span>
                      <span className="text-zinc-500 text-[10px]">
                        {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                      </span>
                    </div>
                    <div className="text-sm font-serif text-white font-semibold">SUBJECT: {m.subject}</div>
                    <p className="text-xs text-zinc-300 leading-relaxed bg-[#080808] p-4 border border-white/5 whitespace-pre-wrap">
                      {m.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. SETTINGS TAB */}
        {activeTab === "settings" && aboutSettings && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-xl font-serif uppercase">SYSTEM CONFIGURATION</h2>
            <form
              onSubmit={handleSaveSettings}
              className="bg-[#0c0c0c] border border-white/10 p-8 rounded-sm space-y-6 text-xs"
            >
              <div className="space-y-4 border-b border-white/10 pb-6">
                <span className="text-amber-400 block tracking-widest uppercase mb-2">// GLOBAL</span>

                {/* PORTRAIT FILE UPLOAD */}
                <div className="space-y-3 border border-white/10 p-4 bg-[#080808]">
                  <label className="text-amber-400 font-bold tracking-wider uppercase flex items-center gap-2">
                    <Upload className="w-4 h-4" /> PORTRAIT IMAGE (ABOUT)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePortraitUpload}
                    className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-mono file:bg-amber-400 file:text-black hover:file:bg-white cursor-pointer"
                  />
                  {uploadingPortrait && (
                    <span className="text-amber-400 animate-pulse block">Uploading portrait...</span>
                  )}
                  {aboutSettings.portraitImage && (
                    <div className="flex items-center gap-4 pt-2">
                      <div className="relative w-24 h-32 bg-zinc-900 border border-amber-400/40 overflow-hidden">
                        <Image
                          src={aboutSettings.portraitImage}
                          alt="Portrait"
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500 break-all max-w-[200px]">
                        {aboutSettings.portraitImage}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">CONTACT EMAIL</label>
                  <input
                    type="email"
                    value={aboutSettings.email || ""}
                    onChange={(e) =>
                      setAboutSettings({ ...aboutSettings, email: e.target.value })
                    }
                    className="w-full bg-[#080808] border border-white/10 p-3 text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4 border-b border-white/10 pb-6">
                <span className="text-amber-400 block tracking-widest uppercase mb-2">// ABOUT TEXT</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-400 block mb-1">HEADLINE MAIN</label>
                    <input
                      type="text"
                      value={aboutSettings.headlineMain || ""}
                      onChange={(e) =>
                        setAboutSettings({ ...aboutSettings, headlineMain: e.target.value })
                      }
                      className="w-full bg-[#080808] border border-white/10 p-3 text-white focus:border-amber-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">HEADLINE ACCENT</label>
                    <input
                      type="text"
                      value={aboutSettings.headlineAccent || ""}
                      onChange={(e) =>
                        setAboutSettings({ ...aboutSettings, headlineAccent: e.target.value })
                      }
                      className="w-full bg-[#080808] border border-white/10 p-3 text-white focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">BIO</label>
                  <textarea
                    rows={5}
                    value={aboutSettings.bio || ""}
                    onChange={(e) =>
                      setAboutSettings({ ...aboutSettings, bio: e.target.value })
                    }
                    className="w-full bg-[#080808] border border-white/10 p-3 text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-amber-400 text-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
              >
                SAVE CONFIGURATION
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ========== ADD / EDIT PROJECT MODAL ========== */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#0c0c0c] border border-white/10 p-8 max-w-2xl w-full rounded-sm space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-lg font-serif text-white uppercase tracking-wider">
                {editingId ? "EDIT PROJECT" : "ADD NEW PROJECT"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-xs text-zinc-500 hover:text-white"
              >
                CLOSE [X]
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">INDEX</label>
                  <input
                    required
                    value={form.index}
                    onChange={(e) => setForm({ ...form, index: e.target.value })}
                    className="w-full bg-[#080808] border border-white/10 p-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">YEAR</label>
                  <input
                    required
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full bg-[#080808] border border-white/10 p-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">TITLE</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 p-2 text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">CATEGORY</label>
                  <input
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#080808] border border-white/10 p-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">CLIENT</label>
                  <input
                    required
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    className="w-full bg-[#080808] border border-white/10 p-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* MAIN IMAGE */}
              <div className="border border-white/10 p-4 bg-[#080808] space-y-3">
                <label className="text-amber-400 font-bold tracking-wider uppercase flex items-center gap-2">
                  <Upload className="w-4 h-4" /> MAIN COVER IMAGE *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainUpload}
                  className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-mono file:bg-amber-400 file:text-black hover:file:bg-white cursor-pointer"
                />
                {uploadingMain && (
                  <span className="text-amber-400 animate-pulse">Uploading...</span>
                )}
                {form.image && (
                  <div className="flex items-center gap-3">
                    <div className="relative w-20 h-14 border border-amber-400/40 overflow-hidden">
                      <Image src={form.image} alt="cover" fill className="object-cover" />
                    </div>
                    <span className="text-[10px] text-zinc-500 break-all">{form.image}</span>
                  </div>
                )}
              </div>

              {/* GALLERY */}
              <div className="border border-white/10 p-4 bg-[#080808] space-y-3">
                <label className="text-amber-400 font-bold tracking-wider uppercase flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> GALLERY IMAGES
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-mono file:bg-amber-400 file:text-black hover:file:bg-white cursor-pointer"
                />
                {uploadingGallery && (
                  <span className="text-amber-400 animate-pulse">Uploading gallery...</span>
                )}
                {form.gallery.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.gallery.map((url, i) => (
                      <div
                        key={i}
                        className="relative w-16 h-12 border border-white/20 overflow-hidden group"
                      >
                        <Image src={url} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setForm((p) => ({
                              ...p,
                              gallery: p.gallery.filter((_, idx) => idx !== i),
                            }))
                          }
                          className="absolute inset-0 bg-red-950/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px]"
                        >
                          REMOVE
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">SHORT DESCRIPTION</label>
                <textarea
                  required
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 p-2 text-white focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">FULL DESCRIPTION</label>
                <textarea
                  required
                  rows={4}
                  value={form.fullDescription}
                  onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 p-2 text-white focus:border-amber-400 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving || uploadingMain || uploadingGallery}
                className="w-full py-3 bg-amber-400 text-black font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
              >
                {saving
                  ? "SAVING..."
                  : editingId
                  ? "UPDATE PROJECT"
                  : "SAVE PROJECT TO MONGODB"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}