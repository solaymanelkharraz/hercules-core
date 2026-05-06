<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentAssignment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'equipment_id',
        'user_id',
        'assigned_at',
        'returned_at',
    ];

    /**
     * Get the equipment that is assigned.
     */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    /**
     * Get the user that is assigned the equipment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
