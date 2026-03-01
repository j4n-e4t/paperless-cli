class PaperlessCli < Formula
  desc "Terminal UI for browsing and searching Paperless-ngx documents"
  homepage "https://github.com/j4n-e4t/paperless-cli"
  version "0.1.0"
  url "https://github.com/j4n-e4t/paperless-cli/releases/download/v#{version}/paperless-cli-#{version}.tar.gz"
  sha256 "REPLACE_WITH_RELEASE_TARBALL_SHA256"
  license "REPLACE_WITH_PROJECT_LICENSE"

  depends_on "node"

  def install
    bin.install "paperless-cli"
    pkgshare.install "README.md" if File.exist?("README.md")
  end

  test do
    assert_equal version.to_s, shell_output("#{bin}/paperless-cli --version").strip
  end
end
