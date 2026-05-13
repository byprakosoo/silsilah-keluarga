"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, ArrowLeft, Camera, X, Loader2 } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Member } from "@/lib/types";
import { createMember, updateMember } from "@/lib/actions/members";
import { MemberInput } from "@/lib/validations";
import { compressImageWithSize } from "@/lib/image-compress";
import Link from "next/link";

interface MemberFormProps {
  initialData?: Member;
  isEditing?: boolean;
}

function emptyToUndef(v: string): string | undefined {
  return v === "" ? undefined : v;
}

export function MemberForm({ initialData, isEditing }: MemberFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    nickname: initialData?.nickname || "",
    gender: (initialData?.gender as "male" | "female") || "male",
    birthDate: initialData?.birthDate || "",
    birthPlace: initialData?.birthPlace || "",
    deathDate: initialData?.deathDate || "",
    deathPlace: initialData?.deathPlace || "",
    isAlive: initialData?.isAlive ?? true,
    religion: initialData?.religion || "",
    occupation: initialData?.occupation || "",
    bio: initialData?.bio || "",
    address: initialData?.address || "",
    generation: initialData?.generation || 1,
  });

  const [photoUrl, setPhotoUrl] = useState<string | null>(
    initialData?.photoUrl || null,
  );
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialData?.photoUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [compressSize, setCompressSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compress before storing
    setCompressing(true);
    setError(null);
    try {
      const result = await compressImageWithSize(file, {
        maxDimension: 800,
        quality: 0.75,
      });
      if (result) {
        setPhotoUrl(result.dataUrl);
        setPhotoPreview(result.dataUrl);
        setCompressSize(result.sizeKb);
      } else {
        setError(
          "Gagal membaca file gambar. Pastikan file adalah gambar yang valid.",
        );
      }
    } catch {
      setError("Gagal mengkompresi gambar. Coba file lain.");
    } finally {
      setCompressing(false);
    }
  };

  const handlePhotoRemove = () => {
    setPhotoUrl(null);
    setPhotoPreview(null);
    setCompressSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const input: MemberInput = {
        fullName: formData.fullName,
        nickname: emptyToUndef(formData.nickname),
        gender: formData.gender,
        birthDate: emptyToUndef(formData.birthDate),
        birthPlace: emptyToUndef(formData.birthPlace),
        deathDate: emptyToUndef(formData.deathDate),
        deathPlace: emptyToUndef(formData.deathPlace),
        isAlive: formData.isAlive,
        religion: emptyToUndef(formData.religion),
        occupation: emptyToUndef(formData.occupation),
        bio: emptyToUndef(formData.bio),
        address: emptyToUndef(formData.address),
        generation: formData.generation,
        photoUrl: photoUrl || undefined,
      };
      if (isEditing && initialData) {
        await updateMember(initialData.id, input);
      } else {
        await createMember(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
      setLoading(false);
    }
  };

  const cardClasses =
    "border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-heritage";
  const inputClasses =
    "border-[var(--outline-variant)] bg-[var(--surface)] focus-visible:ring-[var(--primary)] shadow-heritage";

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {error && (
          <div
            className="p-3 rounded-lg text-sm"
            style={{
              backgroundColor: "var(--error-container)",
              color: "var(--on-error-container)",
            }}
          >
            {error}
          </div>
        )}

        <Card className={cardClasses}>
          <CardHeader className="pb-3">
            <CardTitle
              className="font-serif text-lg"
              style={{
                fontFamily: "var(--font-noto-serif), serif",
                fontSize: "1.75rem",
                color: "var(--on-surface)",
              }}
            >
              Informasi Dasar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-[var(--gold-accent)]" />
                <Avatar className="h-20 w-20 border-2 border-transparent rounded-full">
                  <AvatarImage src={photoPreview || undefined} />
                  <AvatarFallback
                    className="bg-[var(--primary-container)] text-[var(--on-primary-container)] text-xl"
                    style={{ fontFamily: "var(--font-noto-serif), serif" }}
                  >
                    {formData.fullName
                      ? formData.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={handlePhotoRemove}
                    className="absolute -top-1 -right-1 rounded-full bg-[var(--error)] text-white p-0.5 shadow-md hover:bg-red-700 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div>
                <Label
                  className="label-sm"
                  style={{
                    fontFamily: "var(--font-elms-sans), sans-serif",
                    color: "var(--on-surface)",
                  }}
                >
                  Foto Anggota
                </Label>
                <p className="text-xs text-[var(--on-surface-variant)] mt-1 mb-2">
                  Foto akan dikompres otomatis (maks 800px, JPEG)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  id="photo-upload"
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-[var(--outline-variant)] text-[var(--on-surface)]"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={compressing}
                  >
                    {compressing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Camera className="h-3.5 w-3.5" />
                    )}
                    {compressing
                      ? "Mengkompresi..."
                      : photoPreview
                        ? "Ganti Foto"
                        : "Upload Foto"}
                  </Button>
                  {compressSize && !compressing && (
                    <span className="text-xs text-[var(--on-surface-variant)]">
                      ~{compressSize} KB
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="label-sm"
                  style={{
                    fontFamily: "var(--font-elms-sans), sans-serif",
                    color: "var(--on-surface)",
                  }}
                >
                  Nama Lengkap <span style={{ color: "var(--error)" }}>*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Nama lengkap"
                  className={inputClasses}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="nickname"
                  className="label-sm"
                  style={{
                    fontFamily: "var(--font-elms-sans), sans-serif",
                    color: "var(--on-surface)",
                  }}
                >
                  Nama Panggilan
                </Label>
                <Input
                  id="nickname"
                  value={formData.nickname}
                  onChange={(e) => handleChange("nickname", e.target.value)}
                  placeholder="Nama panggilan"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="gender"
                  className="label-sm"
                  style={{
                    fontFamily: "var(--font-elms-sans), sans-serif",
                    color: "var(--on-surface)",
                  }}
                >
                  Jenis Kelamin <span style={{ color: "var(--error)" }}>*</span>
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    handleChange(
                      "gender",
                      (value ?? "male") as "male" | "female",
                    )
                  }
                >
                  <SelectTrigger className={`${inputClasses} w-full`}>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="generation"
                  className="label-sm"
                  style={{
                    fontFamily: "var(--font-elms-sans), sans-serif",
                    color: "var(--on-surface)",
                  }}
                >
                  Generasi ke-
                </Label>
                <Input
                  id="generation"
                  type="number"
                  min={1}
                  max={10}
                  value={formData.generation}
                  onChange={(e) =>
                    handleChange("generation", parseInt(e.target.value) || 1)
                  }
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                style={{
                  fontFamily: "var(--font-elms-sans), sans-serif",
                  color: "var(--on-surface)",
                }}
              >
                Status Hidup
              </Label>
              <div
                className="flex gap-4"
                style={{ fontFamily: "var(--font-elms-sans), sans-serif" }}
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isAlive"
                    checked={formData.isAlive}
                    onChange={() => handleChange("isAlive", true)}
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="text-sm text-[var(--on-surface)]">
                    Hidup
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isAlive"
                    checked={!formData.isAlive}
                    onChange={() => handleChange("isAlive", false)}
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="text-sm text-[var(--on-surface)]">
                    Almarhum
                  </span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cardClasses}>
          <CardHeader className="pb-3">
            <CardTitle
              className="font-serif text-lg"
              style={{
                fontFamily: "var(--font-noto-serif), serif",
                fontSize: "1.75rem",
                color: "var(--on-surface)",
              }}
            >
              Kelahiran & Kematian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="birthDate"
                  className="label-sm"
                  style={{
                    fontFamily: "var(--font-elms-sans), sans-serif",
                    color: "var(--on-surface)",
                  }}
                >
                  Tanggal Lahir
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleChange("birthDate", e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="birthPlace"
                  className="label-sm"
                  style={{
                    fontFamily: "var(--font-elms-sans), sans-serif",
                    color: "var(--on-surface)",
                  }}
                >
                  Tempat Lahir
                </Label>
                <Input
                  id="birthPlace"
                  value={formData.birthPlace}
                  onChange={(e) => handleChange("birthPlace", e.target.value)}
                  placeholder="Kota lahir"
                  className={inputClasses}
                />
              </div>
            </div>

            {!formData.isAlive && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="deathDate"
                    className="label-sm"
                    style={{
                      fontFamily: "var(--font-elms-sans), sans-serif",
                      color: "var(--on-surface)",
                    }}
                  >
                    Tanggal Wafat
                  </Label>
                  <Input
                    id="deathDate"
                    type="date"
                    value={formData.deathDate}
                    onChange={(e) => handleChange("deathDate", e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="deathPlace"
                    className="label-sm"
                    style={{
                      fontFamily: "var(--font-elms-sans), sans-serif",
                      color: "var(--on-surface)",
                    }}
                  >
                    Tempat Wafat
                  </Label>
                  <Input
                    id="deathPlace"
                    value={formData.deathPlace}
                    onChange={(e) => handleChange("deathPlace", e.target.value)}
                    placeholder="Kota wafat"
                    className={inputClasses}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={cardClasses}>
          <CardHeader className="pb-3">
            <CardTitle
              className="font-serif text-lg"
              style={{
                fontFamily: "var(--font-noto-serif), serif",
                fontSize: "1.75rem",
                color: "var(--on-surface)",
              }}
            >
              Informasi Tambahan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="religion"
                  className="label-sm"
                  style={{
                    fontFamily: "var(--font-elms-sans), sans-serif",
                    color: "var(--on-surface)",
                  }}
                >
                  Agama
                </Label>
                <Input
                  id="religion"
                  value={formData.religion}
                  onChange={(e) => handleChange("religion", e.target.value)}
                  placeholder="Agama"
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="occupation"
                  className="label-sm"
                  style={{
                    fontFamily: "var(--font-elms-sans), sans-serif",
                    color: "var(--on-surface)",
                  }}
                >
                  Pekerjaan
                </Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleChange("occupation", e.target.value)}
                  placeholder="Pekerjaan"
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="label-sm"
                style={{
                  fontFamily: "var(--font-elms-sans), sans-serif",
                  color: "var(--on-surface)",
                }}
              >
                Alamat
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Alamat lengkap..."
                rows={2}
                className={`${inputClasses} resize-none`}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="label-sm"
                style={{
                  fontFamily: "var(--font-elms-sans), sans-serif",
                  color: "var(--on-surface)",
                }}
              >
                Biografi Singkat
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Tulis biografi singkat..."
                rows={4}
                className={`${inputClasses} resize-none`}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button variant="ghost" type="button" asChild>
            <Link href="/admin/anggota" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Batal
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="gap-2"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--on-primary)",
            }}
          >
            <Save className="h-4 w-4" />
            {loading
              ? "Menyimpan..."
              : isEditing
                ? "Simpan Perubahan"
                : "Simpan Anggota"}
          </Button>
        </div>
      </div>
    </form>
  );
}
