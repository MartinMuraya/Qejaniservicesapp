import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function ProviderFilters({ onFilterChange }) {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        minPrice: '',
        maxPrice: '',
        minRating: '',
        sort: '-averageRating'
    });

    const handleChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const defaultFilters = {
            search: '',
            minPrice: '',
            maxPrice: '',
            minRating: '',
            sort: '-averageRating'
        };
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            {/* Search Bar */}
            <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search providers by name..."
                    value={filters.search}
                    onChange={(e) => handleChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
            </div>

            {/* Filter Toggle Button */}
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-green-600 font-medium hover:text-green-700 mb-4"
            >
                <FunnelIcon className="w-5 h-5" />
                <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            </button>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="space-y-4 pt-4 border-t">
                    {/* Price Range */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Min Price (KSh)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={filters.minPrice}
                                onChange={(e) => handleChange('minPrice', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Max Price (KSh)</label>
                            <input
                                type="number"
                                placeholder="10000"
                                value={filters.maxPrice}
                                onChange={(e) => handleChange('maxPrice', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                        <select
                            value={filters.minRating}
                            onChange={(e) => handleChange('minRating', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="">Any Rating</option>
                            <option value="4">4+ Stars</option>
                            <option value="3">3+ Stars</option>
                            <option value="2">2+ Stars</option>
                            <option value="1">1+ Stars</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Sort By</label>
                        <select
                            value={filters.sort}
                            onChange={(e) => handleChange('sort', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="-averageRating">Highest Rated</option>
                            <option value="price">Price: Low to High</option>
                            <option value="-price">Price: High to Low</option>
                            <option value="-popularity">Most Popular</option>
                            <option value="-createdAt">Newest First</option>
                        </select>
                    </div>

                    {/* Clear Filters Button */}
                    <button
                        onClick={clearFilters}
                        className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
}
