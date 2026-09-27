import {
  useEffect,
  useState,
} from 'react'
import {
  ArrowLeft,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Search,
  Trash2,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMenuStore } from '../../store/menuStore'
import type {
  FoodCategory,
  SpiceLevel,
} from '../../types/menu'

const categories: FoodCategory[] = [
  'Starters',
  'Main Course',
  'Breads',
  'Rice',
  'Desserts',
  'Beverages',
]

export default function MenuManagementPage() {
  const navigate = useNavigate()

  const items = useMenuStore((state) => state.items)
  const subscribeToMenu = useMenuStore(
    (state) => state.subscribeToMenu,
  )

  const seedMenu = useMenuStore(
    (state) => state.seedMenu,
  )

  const loading = useMenuStore(
    (state) => state.loading,
  )

  const firestoreError = useMenuStore(
      (state) => state.error,
    )
    useEffect(() => {
    const unsubscribe = subscribeToMenu()

    return unsubscribe
  }, [subscribeToMenu])
  const addItem = useMenuStore((state) => state.addItem)
  const updateItem = useMenuStore(
    (state) => state.updateItem,
  )
  const toggleAvailability = useMenuStore(
    (state) => state.toggleAvailability,
  )
  const deleteItem = useMenuStore(
    (state) => state.deleteItem,
  )

  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] =
    useState<string | null>(null)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] =
    useState<FoodCategory>('Main Course')
  const [vegetarian, setVegetarian] =
    useState(true)
  const [spiceLevel, setSpiceLevel] =
    useState<SpiceLevel>('Mild')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [description, setDescription] =
    useState('')

  const filteredItems = items.filter((item) =>
    item.name
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  const resetForm = () => {
    setEditingId(null)
    setName('')
    setPrice('')
    setCategory('Main Course')
    setVegetarian(true)
    setSpiceLevel('Mild')
    setCalories('')
    setProtein('')
    setDescription('')
    setShowForm(false)
  }

  const handleEdit = (id: string) => {
    const item = items.find(
      (menuItem) => menuItem.id === id,
    )

    if (!item) return

    setEditingId(item.id)
    setName(item.name)
    setPrice(item.price.toString())
    setCategory(item.category)
    setVegetarian(item.vegetarian)
    setSpiceLevel(item.spiceLevel)
    setCalories(item.calories.toString())
    setProtein(item.protein.toString())
    setDescription(item.description)
    setShowForm(true)
  }

   const handleSave = async () => {
    if (!name.trim() || Number(price) <= 0) {
      return
    }

    if (editingId) {
      await updateItem(editingId, {
        name: name.trim(),
        price: Number(price),
        category,
        vegetarian,
        spiceLevel,
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        description,
      })

      resetForm()
      return
    }

    const id = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    await addItem({
      id: `${id}-${Date.now()}`,
      name: name.trim(),
      description,
      price: Number(price),
      category,

      imageUrl: '/images/food-placeholder.jpg',

      vegetarian,
      spiceLevel,

      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: 0,
      fat: 0,

      rating: 0,
      reviewCount: 0,
      preparationTime: 20,

      ingredients: [],
      allergens: [],
      tags: [],

      available: true,
    })

    resetForm()
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3]">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/manager')}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                Manager
              </p>

              <h1 className="text-xl font-black">
                Menu Management
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white"
          >
            <Plus size={18} />
            Add Dish
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                await seedMenu()

                alert(
                  'Menu uploaded to Firebase successfully.',
                )
              } catch (error) {
                alert(
                  error instanceof Error
                    ? error.message
                    : 'Unable to upload menu.',
                )
              }
            }}
            className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-600"
          >
            Seed Firebase Menu
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {loading && (
          <div className="mb-5 rounded-2xl bg-white p-5 text-sm font-bold text-neutral-500">
            Loading menu from Firebase...
          </div>
        )}

        {firestoreError && (
          <div className="mb-5 rounded-2xl bg-red-50 p-5 text-sm font-bold text-red-600">
            {firestoreError}
          </div>
        )}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Summary
            label="Total Dishes"
            value={items.length}
          />

          <Summary
            label="Available"
            value={
              items.filter((item) => item.available)
                .length
            }
          />

          <Summary
            label="Vegetarian"
            value={
              items.filter((item) => item.vegetarian)
                .length
            }
          />

          <Summary
            label="Unavailable"
            value={
              items.filter((item) => !item.available)
                .length
            }
          />
        </section>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4">
          <Search
            size={19}
            className="text-neutral-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search menu items..."
            className="h-13 flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/9] bg-orange-50">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      'none'
                  }}
                />

                <div className="absolute left-3 top-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                      item.available
                        ? 'bg-green-500 text-white'
                        : 'bg-neutral-700 text-white'
                    }`}
                  >
                    {item.available
                      ? 'AVAILABLE'
                      : 'UNAVAILABLE'}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-black">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-xs text-neutral-400">
                      {item.category}
                    </p>
                  </div>

                  <span className="text-lg font-black">
                    ₹{item.price}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold">
                  <span
                    className={
                      item.vegetarian
                        ? 'text-green-600'
                        : 'text-red-500'
                    }
                  >
                    {item.vegetarian
                      ? '● VEG'
                      : '● NON-VEG'}
                  </span>

                  <span className="text-neutral-400">
                    {item.spiceLevel}
                  </span>

                  <span className="text-neutral-400">
                    {item.calories} kcal
                  </span>

                  <span className="text-neutral-400">
                    {item.protein}g protein
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(item.id)
                    }
                    className="flex items-center justify-center gap-1 rounded-xl bg-neutral-100 px-2 py-2.5 text-xs font-bold"
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toggleAvailability(item.id)
                    }
                    className="flex items-center justify-center gap-1 rounded-xl bg-orange-50 px-2 py-2.5 text-xs font-bold text-orange-600"
                  >
                    {item.available ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}

                    {item.available
                      ? 'Hide'
                      : 'Show'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete ${item.name}?`,
                        )
                      ) {
                        deleteItem(item.id)
                      }
                    }}
                    className="flex items-center justify-center gap-1 rounded-xl bg-red-50 px-2 py-2.5 text-xs font-bold text-red-500"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
          <div className="mx-auto my-6 max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-orange-500">
                  Menu
                </p>

                <h2 className="text-xl font-black">
                  {editingId
                    ? 'Edit Dish'
                    : 'Add Dish'}
                </h2>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <Field
                label="Dish Name"
                value={name}
                onChange={setName}
                placeholder="Chicken Biryani"
              />

              <Field
                label="Price"
                value={price}
                onChange={setPrice}
                type="number"
                placeholder="320"
              />

              <div>
                <label className="text-sm font-bold">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target
                        .value as FoodCategory,
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-3 outline-none"
                >
                  {categories.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-bold">
                    Food Type
                  </label>

                  <select
                    value={
                      vegetarian
                        ? 'veg'
                        : 'non-veg'
                    }
                    onChange={(event) =>
                      setVegetarian(
                        event.target.value ===
                          'veg',
                      )
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-3"
                  >
                    <option value="veg">
                      Vegetarian
                    </option>

                    <option value="non-veg">
                      Non-Vegetarian
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold">
                    Spice Level
                  </label>

                  <select
                    value={spiceLevel}
                    onChange={(event) =>
                      setSpiceLevel(
                        event.target
                          .value as SpiceLevel,
                      )
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-3"
                  >
                    <option value="Mild">
                      Mild
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Spicy">
                      Spicy
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Calories"
                  value={calories}
                  onChange={setCalories}
                  type="number"
                  placeholder="520"
                />

                <Field
                  label="Protein (g)"
                  value={protein}
                  onChange={setProtein}
                  type="number"
                  placeholder="28"
                />
              </div>

              <div>
                <label className="text-sm font-bold">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-neutral-200 p-3 outline-none focus:border-orange-400"
                  placeholder="Describe the dish..."
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 font-bold text-white"
            >
              <UtensilsCrossed size={18} />

              {editingId
                ? 'Save Changes'
                : 'Add to Menu'}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

function Summary({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-xs font-bold text-neutral-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black">
        {value}
      </p>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
}) {
  return (
    <div>
      <label className="text-sm font-bold">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-xl border border-neutral-200 px-3 outline-none focus:border-orange-400"
      />
    </div>
  )
}