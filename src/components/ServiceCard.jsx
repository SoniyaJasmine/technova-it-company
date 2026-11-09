function ServiceCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300">
      <div className="text-4xl mb-5">{icon}</div>

      <h3 className="text-xl font-bold text-slate-900 mb-3">
        {title}
      </h3>

      <p className="text-gray-600 leading-7">
        {description}
      </p>
    </div>
  )
}

export default ServiceCard