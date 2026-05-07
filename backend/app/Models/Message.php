<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    protected $fillable = [
        'user_id',
        'incident_id',
        'message',
        'image_path'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function incidentReport(): BelongsTo
    {
        return $this->belongsTo(IncidentReport::class, 'incident_id');
    }
}
