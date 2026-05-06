<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'sku_code',
        'name',
        'category',
        'zone_id',
        'status',
        'last_inspection_date',
    ];

    /**
     * Get the zone that owns the equipment.
     */
    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    /**
     * Get the equipment assignments for the equipment.
     */
    public function equipmentAssignments(): HasMany
    {
        return $this->hasMany(EquipmentAssignment::class);
    }

    /**
     * Get the incident reports for the equipment.
     */
    public function incidentReports(): HasMany
    {
        return $this->hasMany(IncidentReport::class);
    }
}
