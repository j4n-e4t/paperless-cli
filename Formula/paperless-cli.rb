class PaperlessCli < Formula
  desc "Terminal UI for browsing and searching Paperless-ngx documents"
  homepage "https://github.com/j4n-e4t/paperless-cli"
  url "https://github.com/j4n-e4t/paperless-cli/archive/refs/tags/v0.1.0.tar.gz"
  sha256 "REPLACE_WITH_RELEASE_TARBALL_SHA256"
  license "REPLACE_WITH_PROJECT_LICENSE"

  depends_on "node"
  depends_on "oven-sh/bun/bun" => :build

  def install
    system "bun", "install", "--frozen-lockfile"
    system "bun", "run", "build"
    bin.install "dist/paperless-cli"
  end

  test do
    assert_equal version.to_s, shell_output("#{bin}/paperless-cli --version").strip
  end
end
