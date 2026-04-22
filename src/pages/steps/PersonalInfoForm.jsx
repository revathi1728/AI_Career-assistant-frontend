

export default function PersonalInfoForm({ form, setForm }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Personal Information</h2>
      <input
        className="input"
        placeholder="Full Name"
        value={form.name || ""}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="input mt-2"
        placeholder="Email"
        value={form.email || ""}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="input mt-2"
        placeholder="Phone"
        value={form.phone || ""}
        onChange={e => setForm({ ...form, phone: e.target.value })}
      />
    </div>
  );
}
