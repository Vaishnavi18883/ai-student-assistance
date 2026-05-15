import React from 'react'

const Reports = () => {

  const reports = [
    {
      title: "Total Learners",
      value: 120
    },
    {
      title: "Total Tasks",
      value: 45
    },
    {
      title: "Completed Tasks",
      value: 30
    },
    {
      title: "AI Queries",
      value: 85
    }
  ]

  const activities = [
    {
      learner: "Vaishnavi",
      activity: "Completed React Assignment",
      date: "10 May 2026"
    },
    {
      learner: "Rahul",
      activity: "Asked AI about JavaScript",
      date: "10 May 2026"
    },
    {
      learner: "Sneha",
      activity: "Updated Learner Profile",
      date: "09 May 2026"
    }
  ]

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-10">

      {/* Heading */}

      <div className="mb-10">

        <h1 className="text-5xl font-bold">
          Reports & Analytics
        </h1>

        <p className="text-gray-400 mt-3 text-lg">
          Monitor learner activities and statistics
        </p>

      </div>

      {/* Stats Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-14">

        {reports.map((item, index) => (

          <div
            key={index}
            className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-2xl"
          >

            <h2 className="text-xl text-gray-400 mb-4">
              {item.title}
            </h2>

            <h1 className="text-5xl font-bold">
              {item.value}
            </h1>

          </div>

        ))}

      </div>

      {/* Activity Table */}

      <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-2xl overflow-x-auto">

        <h2 className="text-3xl font-bold mb-8">
          Recent Activities
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b border-gray-700 text-left">

              <th className="pb-4">Learner</th>
              <th className="pb-4">Activity</th>
              <th className="pb-4">Date</th>

            </tr>

          </thead>

          <tbody>

            {activities.map((activity, index) => (

              <tr
                key={index}
                className="border-b border-gray-700"
              >

                <td className="py-5">
                  {activity.learner}
                </td>

                <td className="py-5">
                  {activity.activity}
                </td>

                <td className="py-5">
                  {activity.date}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Reports